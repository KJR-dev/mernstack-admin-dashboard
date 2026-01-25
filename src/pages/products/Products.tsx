import { Breadcrumb, Button, Flex, Form, Space, Table, Image, Typography, Tag, Spin, Drawer, theme } from "antd"
import { Link } from "react-router-dom"
import { LoadingOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import ProductsFilter from "./ProductsFilter";
import { useEffect, useMemo, useState } from "react";
import { PER_PAGE } from "../../constants";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduct, getProducts, updateProduct } from "../../http/api";
import type { FieldData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";
import { useForm } from "antd/es/form/Form";
import { makeFormData } from "./forms/helper";

const columns = [
    {
        title: 'Product name',
        dataIndex: 'name',
        key: 'email',
        render: (_text: string, record: Product) => {
            return (
                <Space>
                    <Image width={60} src={record.image} preview={false} />
                    <Typography.Text>{record.name}</Typography.Text>
                </Space>
            )
        }
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Status',
        dataIndex: 'isPublish',
        key: 'isPublish',
        render: (_text: boolean, record: Product) => {
            return (
                <>
                    {record.isPublish ? <Tag color="green">Publish</Tag> : <Tag color="red">Draft</Tag>}
                </>
            )
        }
    },
    {
        title: 'CreatedAt',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => {
            return (
                <Typography.Text>
                    {format(new Date(text), "dd/mm/yyyy HH:mm")}
                </Typography.Text>
            )

        }
    },

]



const Products = () => {
    const [form] = useForm();
    const [filterForm] = Form.useForm();
    const [selectedProduct, setCurrentProduct] = useState<Product | null>(null);
    const { user } = useAuthStore();
    const { token: { colorBgLayout } } = theme.useToken();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const queryClient = useQueryClient();

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: PER_PAGE,
        isPublish: false,
        tenantId: user!.role === 'manager' ? user?.tenant?.id : undefined,
    })

    const {
        data: products,
        isFetching,
        isError,
        error
    } = useQuery({
        queryKey: ["products", queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1])
            )
            const queryString = new URLSearchParams(filteredParams as unknown as Record<string, string>).toString();
            return getProducts(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData,
    });

    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, query: value, page: 1 }))
        }, 500);
    }, []);

    const onFilterChange = (changedFields: FieldData[]) => {
        const changedFilterFields = changedFields
            .map((item) => ({ [item.name[0]]: item.value }))
            .reduce((acc, item) => ({ ...acc, ...item }), {});
        if ('query' in changedFilterFields) {
            debouncedQUpdate(changedFilterFields.query)
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedFilterFields, page: 1 }));
        }
    }

    const { mutate: productMutate, isPending: isCreateLoading } = useMutation({
        mutationKey: ['product'],
        mutationFn: async (data: FormData) => {
            if (selectedProduct) {
                return updateProduct(data, selectedProduct._id).then((res) => res.data);
            } else {
                return createProduct(data).then((res) => res.data)
            }

        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: (['products']) });
            form.resetFields();
            setDrawerOpen(false);
            return;
        }
    })

    useEffect(() => {
        if (selectedProduct) {
            setDrawerOpen(true);
            const priceConfiguration = Object.entries(selectedProduct.priceConfiguration).reduce((acc, [key, value]) => {
                const stringifiedKey = JSON.stringify({
                    configurationKey: key,
                    priceType: value.priceType,
                });
                return {
                    ...acc,
                    [stringifiedKey]: value.availableOptions,
                }
            }, {})
            const attributes = selectedProduct.attributes.reduce((acc, item) => {
                return {
                    ...acc,
                    [item.name]: item.value,
                }
            }, {})
            form.setFieldsValue({
                ...selectedProduct,
                priceConfiguration,
                attributes,
                categoryId: selectedProduct.category._id,
            })
        }
    }, [selectedProduct, form]);

    const onHandleSubmit = async () => {
        await form.validateFields();

        const priceConfiguration = Object.entries(form.getFieldValue('priceConfiguration')).reduce((acc, [key, value]) => {
            const parsedKey = JSON.parse(key);
            return {
                ...acc,
                [parsedKey.configurationKey]: {
                    priceType: parsedKey.priceType,
                    availableOptions: value,
                }
            }
        }, {})

        const categoryId = form.getFieldValue("categoryId");

        const attributes = Object.entries(form.getFieldValue('attributes')).map(([key, value]) => {
            return {
                name: key,
                value: value
            }
        });

        const postData = {
            ...form.getFieldsValue(),
            tenantId: user?.role !== 'manager' ? form.getFieldValue('tenantId') : user?.tenant?.id,
            image: form.getFieldValue("image"),
            attributes,
            categoryId,
            priceConfiguration,
        }

        const formData = makeFormData(postData);

        await productMutate(formData);
    }

    return <>
        <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
            <Flex justify='space-between'>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        {
                            title: <Link to='/'>Dashboard</Link>,
                            // href: '/',
                        },
                        {
                            title: 'Products',
                            href: '#',
                        },
                    ]}
                />
                {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
                {isError && <Typography.Text type="danger">{error.message}</Typography.Text >}
            </Flex>
            <Form form={filterForm} onFieldsChange={onFilterChange}>
                <ProductsFilter>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        setDrawerOpen(true)
                    }}>Add Product</Button>
                </ProductsFilter>
            </Form>

            <Table
                columns={[
                    ...columns,
                    {
                        title: 'Action',
                        render: (_, record: Product) => {
                            return (
                                <Space>
                                    <Button type="link" onClick={() => { setCurrentProduct(record) }}>Edit</Button>
                                    <Button type="link" onClick={() => { }}>Delete</Button>
                                </Space>
                            )
                        }
                    },
                ]}
                dataSource={products?.data}
                rowKey={'_id'}
                pagination={{
                    total: products?.total,
                    pageSize: queryParams.limit,
                    current: queryParams.page,
                    onChange: (page) => {
                        setQueryParams((prev) => {
                            return {
                                ...prev,
                                page: page
                            }
                        })
                    },
                    showTotal: (total: number, range: number[]) => {
                        return `Showing ${range[0]}-${range[1]} of ${total} items`;
                    }
                }}
            />
            <Drawer
                title={selectedProduct ? "Update Product" : "Add Product"}
                width={720}
                styles={{ body: { backgroundColor: colorBgLayout } }}
                open={drawerOpen}
                destroyOnHidden={true}
                onClose={() => {
                    setCurrentProduct(null);
                    setDrawerOpen(false);
                    // setCurrentEditingUser(null);
                    form.resetFields();
                }}
                extra={
                    <Space>
                        <Button onClick={() => {
                            setCurrentProduct(null);
                            setDrawerOpen(false);
                            form.resetFields();
                        }}>Cancel</Button>
                        <Button type="primary" onClick={onHandleSubmit} loading={isCreateLoading}>Submit</Button>
                    </Space>
                }
            >
                <Form layout="vertical" form={form}>
                    <ProductForm form={form} />
                </Form>
            </Drawer>
        </Space>

    </>
}

export default Products