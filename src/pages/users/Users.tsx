import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link, Navigate } from "react-router-dom";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import type { CreateUserData, User } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./forms/UserForm";

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Name',
    dataIndex: ['firstName', 'lastName'],
    key: 'Name',
    render: (_text: string, record: User) => {
      return (
        <div>{record.firstName} {record.lastName}</div>
      )
    }
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Restaurant',
    dataIndex: ['tenant', 'name'],
    key: 'tenantName',
    render: (text: string) => text || 'Not set',
  },
]

const Users = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { token: { colorBgLayout } } = theme.useToken();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => res.data);
    }
  })
  const { user } = useAuthStore();

  const { mutate: userMutate } = useMutation({
    mutationKey: ['user'],
    mutationFn: async (data: CreateUserData) => createUser(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      return;
    }
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    await userMutate(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace={true} />
  }
  return (
    <div>
      <Space direction="vertical" size={"large"} style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            {
              title: <Link to='/'>Dashboard</Link>,
              // href: '/',
            },
            {
              title: 'Users',
              href: '#',
            },
          ]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}
        <UsersFilter onFilterChange={(filterName: string, filterValue: string) => {
          console.log(filterName, filterValue);
        }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>Add User</Button>
        </UsersFilter>
        <Table columns={columns} dataSource={users} rowKey={'id'} />
        <Drawer
          title='Add User'
          width={720}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          open={drawerOpen}
          destroyOnHidden={true}
          onClose={() => {
            setDrawerOpen(false);
            form.resetFields();
          }}
          extra={
            <Space>
              <Button onClick={() => {
                setDrawerOpen(false);
                form.resetFields();
              }}>Cancel</Button>
              <Button type="primary" onClick={onHandleSubmit}>Submit</Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </div>
  )
}

export default Users