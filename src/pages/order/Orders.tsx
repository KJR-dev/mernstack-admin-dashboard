import { RightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb, Flex, Space, Table, Tag, Typography } from 'antd';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { getOrders } from '../../http/api';
import type { Order } from '../../types';
import { capitalizeFirst } from '../products/forms/helper';
import { colorMapping } from '../../constants';

const columns = [
  {
    title: 'Order Id',
    dataIndex: '_id',
    key: '_id',
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record._id}</Typography.Text>;
    },
  },
  {
    title: 'Customer',
    dataIndex: 'customerId',
    key: 'customerId._id',
    render: (_text: string, record: Order) => {
      if (!record.customerId) {
        return '';
      }

      return (
        <Typography.Text>
          {record.customerId.firstName} {record.customerId.lastName}
        </Typography.Text>
      );
    },
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record.address}</Typography.Text>;
    },
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record?.comment}</Typography.Text>;
    },
  },
  {
    title: 'Payment Mode',
    dataIndex: 'paymentMode',
    key: 'paymentMode',
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record.paymentMode}</Typography.Text>;
    },
  },
  {
    title: 'Order Status',
    dataIndex: 'orderStatus',
    key: 'orderStatus',
    render: (_text: string, record: Order) => {
      return <Tag bordered={false} color={colorMapping[record.orderStatus]}>{capitalizeFirst(record.orderStatus)}</Tag>;
    },
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (text: string) => {
      return <Typography.Text>₹{text}</Typography.Text>;
    },
  },
  {
    title: 'Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), 'dd/MM/yyyy HH:mm')}
        </Typography.Text>
      );
    },
  },
  {
    title: 'Action',
    render: (_: string, record: Order) => {
      return <Link to={`/orders/${record._id}`}>Details</Link>;
    },
  },
];
const TENANT_ID = 3;
const Orders = () => {
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => {
      // If admin user then make sure to send tenantId or tenantId from selected filter.
      const queryString = new URLSearchParams({
        tenantId: String(TENANT_ID),
      }).toString();
      return getOrders(queryString).then((res) => res.data);
    },
  });
  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              {
                title: <Link to="/">Dashboard</Link>,
              },
              {
                title: 'Orders',
              },
            ]}
          />
        </Flex>

        {/* Content */}
        <Table
          columns={columns}
          rowKey="_id"
          dataSource={orders}
          //   pagination={{ pageSize: 10 }}
          //   scroll={{ x: 'max-content' }}
        />
      </Space>
    </>
  );
};

export default Orders;
