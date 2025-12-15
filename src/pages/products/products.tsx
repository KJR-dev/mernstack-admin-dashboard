import { Breadcrumb, Button, Flex, Form, Space, Table, Image, Typography, Tag, Spin } from "antd"
import { Link } from "react-router-dom"
import { LoadingOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import ProductsFilter from "./ProductsFilter";
import { useMemo, useState } from "react";
import { PER_PAGE } from "../../constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import type { FieldData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";

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
    const [filterForm] = Form.useForm();

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: PER_PAGE,
        isPublish: false
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
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { }}>Add Product</Button>
                </ProductsFilter>
            </Form>

            <Table
                columns={[
                    ...columns,
                    {
                        title: 'Action',
                        render: () => {
                            return (
                                <Space>
                                    <Button type="link" onClick={() => { }}>Edit</Button>
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
        </Space>

    </>
}

export default Products