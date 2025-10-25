import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, theme, Typography } from "antd";
import { LoadingOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Link, Navigate } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import type { CreateUserData, FieldData, User } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./forms/UserForm";
import { PER_PAGE } from "../../constants";

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
  const [filterForm] = Form.useForm();
  const { token: { colorBgLayout } } = theme.useToken();
  const [queryParams, setQueryParams] = useState({
    currentPage: 1,
    perPage: PER_PAGE,

  })
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: users, isFetching, isError, error } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {
      const fillteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      )
      const queryString = new URLSearchParams(fillteredParams as unknown as Record<string, string>).toString();
      return getUsers(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });
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

  const onFilterChange = (changedFields: FieldData[]) => {
    console.log(changedFields);
    const changedFilterFilelds = changedFields
      .map((item) => ({ [item.name[0]]: item.value }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    setQueryParams((prev) => ({ ...prev, ...changedFilterFilelds }))
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace={true} />
  }
  return (
    <div>
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
                title: 'Users',
                href: '#',
              },
            ]}
          />
          {isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
          {isError && <Typography.Text type="danger">{error.message}</Typography.Text >}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UsersFilter>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>Add User</Button>
          </UsersFilter>
        </Form>
        <Table
          columns={columns}
          dataSource={users?.data}
          rowKey={'id'}
          pagination={{
            total: users?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page
                }
              })
            }
          }}
        />
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