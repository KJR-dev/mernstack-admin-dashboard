import { Breadcrumb, Space, Table } from "antd";
import { RightOutlined } from '@ant-design/icons';
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import type { User } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";

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
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => res.data);
    }
  })
  const { user } = useAuthStore();
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
        }} />
        <Table columns={columns} dataSource={users} rowKey={'id'} />
      </Space>
    </div>
  )
}

export default Users