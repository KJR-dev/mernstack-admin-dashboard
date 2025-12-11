import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd"
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import TenantsFilter from "./TenantsFilter";
import { useState } from "react";
import { TenantForm } from "./forms/TenantForm";
import type { CreateTenant } from "../../types";

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
    const queryClient = useQueryClient();
    const {
        token: { colorBgLayout },
    } = theme.useToken();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { data: tenants, isLoading, isError, error } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => {
            return getTenants().then((res) => res.data);
        }
    });

    const { mutate: tenantMutate } = useMutation({
        mutationKey: ['tenant'],
        mutationFn: async (data: CreateTenant) => createTenant(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: (['tenants'])})
            return;
        }
    })
    const onHandleSubmit = async () => {
        await form.validateFields();
        await tenantMutate(form.getFieldsValue())
        form.resetFields();
        setDrawerOpen(false);
    }
    return (
        <div>
            <Space direction="vertical" size={"large"} style={{ width: '100%' }}>
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
                {isLoading && <div>Loading...</div>}
                {isError && <div>{error.message}</div>}
                <TenantsFilter onFilterChange={(filterName: string, filterValue: string) => {
                    console.log(filterName, filterValue);
                }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>Add Tenant</Button>
                </TenantsFilter>
                <Table columns={columns} dataSource={tenants} rowKey={'id'} />
                <Drawer
                    title="Add Tenant"
                    width={720}
                    styles={{ body: { background: colorBgLayout } }}
                    closable={{ 'aria-label': 'Close Button' }}
                    open={drawerOpen}
                    destroyOnHidden={true}
                    onClose={() => {
                        form.resetFields();
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button onClick={() => {
                                form.resetFields();
                                setDrawerOpen(false);
                            }}>Cancel</Button>
                            <Button type="primary" onClick={onHandleSubmit}>Submit</Button>
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