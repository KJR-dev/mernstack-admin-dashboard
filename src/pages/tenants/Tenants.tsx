import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, theme, Typography } from "antd"
import { LoadingOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants, updateTenant } from "../../http/api";
import TenantsFilter from "./TenantsFilter";
import { useEffect, useMemo, useState } from "react";
import { TenantForm } from "./forms/TenantForm";
import type { CreateTenant, FieldData, Tenant } from "../../types";
import { PER_PAGE } from "../../constants";
import { debounce } from "lodash";

const columns = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    }
]

const Tenants = () => {
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const [currentEditingTenant, setCurrentEditingTenant] = useState<Tenant | null>(null)
    const queryClient = useQueryClient();
    const {
        token: { colorBgLayout },
    } = theme.useToken();
    const [queryParams, setQueryParams] = useState(
        {
            currentPage: 1,
            perPage: PER_PAGE,
        }
    );
    const [drawerOpen, setDrawerOpen] = useState(false);
    useEffect(() => {
        if (currentEditingTenant) {
            setDrawerOpen(true);
            form.setFieldsValue(currentEditingTenant);
        }
    }, [currentEditingTenant, form]);

    const { data: tenants, isFetching, isError, error } = useQuery({
        queryKey: ["tenants", queryParams],
        queryFn: () => {
            const filterParams = Object.fromEntries(Object.entries(queryParams).filter(item => !!item[1]))
            const queryString = new URLSearchParams(filterParams as unknown as Record<string, string>).toString();
            return getTenants(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData,
    });

    const { mutate: tenantMutate } = useMutation({
        mutationKey: ['tenant'],
        mutationFn: async (data: CreateTenant) => createTenant(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: (['tenants']) })
            return;
        }
    })

    const { mutate: updateTenantMutate } = useMutation({
        mutationKey: ['update-tenant'],
        mutationFn: async (data: CreateTenant) => updateTenant(data, currentEditingTenant!.id).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: (['tenants']) })
            return;
        }
    })

    const onHandleSubmit = async () => {
        const isEditMode = !!currentEditingTenant;
        await form.validateFields();
        if (isEditMode) {
            await updateTenantMutate(form.getFieldsValue())
        } else {
            await tenantMutate(form.getFieldsValue())
        }
        form.resetFields();
        setCurrentEditingTenant(null);
        setDrawerOpen(false);
    }
    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }))
        }, 500);
    }, []);
    const onFilterChange = async (changedFields: FieldData[]) => {
        const changedFilterFields = changedFields.map((item) => ({
            [item.name[0]]: item.value
        })).reduce((acc, item) => ({
            ...acc, ...item
        }), {});
        if ('q' in changedFilterFields) {
            debouncedQUpdate(changedFilterFields.q);
        } else {
            setQueryParams((prev) => ({
                ...prev,
                ...changedFilterFields,
                currentPage: 1
            }));
        }

    }
    return (
        <div>
            <Space direction="vertical" size={"large"} style={{ width: '100%' }}>
                <Flex justify="space-between">
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[
                            {
                                title: <Link to='/'>Dashboard</Link>,
                                // href: '/',
                            },
                            {
                                title: 'Tenants',
                                href: '#',
                            },
                        ]}
                    />
                    {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
                    {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
                </Flex>
                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <TenantsFilter>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>Add Tenant</Button>
                    </TenantsFilter>
                </Form>
                <Table
                    columns={[
                        ...columns,
                        {
                            title: 'Action',
                            render: (_: string, record: Tenant) => {
                                return (
                                    <Space>
                                        <Button type="link" onClick={() => {
                                            setCurrentEditingTenant(record);
                                        }}>Edit</Button>
                                        <Button type="link">Delete</Button>
                                    </Space>
                                )
                            }
                        }
                    ]}
                    dataSource={tenants?.data}
                    rowKey={'id'}
                    pagination={{
                        total: tenants?.total,
                        current: queryParams.currentPage,
                        pageSize: PER_PAGE,
                        onChange: (page) => {
                            setQueryParams((prev) => {
                                return {
                                    ...prev,
                                    currentPage: page,
                                }
                            })
                        },
                        showTotal: (total: number, range: number[]) => {
                            return `Showing ${range[0]}-${range[1]} of ${total} items`;
                        }
                    }}
                />
                <Drawer
                    title={currentEditingTenant ? "Update Tenant" : "Add Tenant"}
                    width={720}
                    styles={{ body: { background: colorBgLayout } }}
                    closable={{ 'aria-label': 'Close Button' }}
                    open={drawerOpen}
                    destroyOnHidden={true}
                    onClose={() => {
                        form.resetFields();
                        setCurrentEditingTenant(null);
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button onClick={() => {
                                form.resetFields();
                                setCurrentEditingTenant(null);
                                setDrawerOpen(false);
                            }}>Cancel</Button>
                            <Button type="primary" onClick={onHandleSubmit}>{currentEditingTenant ? "Update" : "Submit"}</Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" form={form}>
                        <TenantForm />
                    </Form>
                </Drawer>
            </Space>
        </div>
    )
}

export default Tenants