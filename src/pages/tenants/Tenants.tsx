import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd"
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import TenantsFilter from "./TenantsFilter";
import { useState } from "react";
import { TenantForm } from "./forms/TenantForm";

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
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button>Cancel</Button>
                            <Button type="primary">Submit</Button>
                        </Space>
                    }
                >
                    <Form layout="vertical">
                        <TenantForm />
                    </Form>
                </Drawer>
            </Space>
        </div>
    )
}

export default Tenants