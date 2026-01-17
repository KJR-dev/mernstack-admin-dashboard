import { RightOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Descriptions,
  Flex,
  List,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import { format } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { colorMapping } from '../../constants';
import { changeOrderStatus, getSingleOrder } from '../../http/api';
import type { Order, OrderStatus } from '../../types';
import { capitalizeFirst } from '../products/forms/helper';

const orderStatusOptions = [
  {
    value: 'received',
    label: 'Received',
  },
  {
    value: 'confirmed',
    label: 'Confirmed',
  },
  {
    value: 'prepared',
    label: 'Prepared',
  },
  {
    value: 'out_for_delivery',
    label: 'Out For Delivery',
  },
  {
    value: 'delivered',
    label: 'Delivered',
  },
];

const SingleOrder = () => {
  const { orderId } = useParams();

  const { data: order } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => {
      const queryString = new URLSearchParams({
        fields:
          'cart,address,paymentMode,tenantId,total,comment,paymentStatus,orderStatus,createdAt,customerId',
      }).toString();

      return getSingleOrder(orderId as string, queryString).then(
        (res) => res.data,
      );
    },
    enabled: !!orderId,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ['order', orderId],
    mutationFn: async (status: OrderStatus) => {
      return await changeOrderStatus(orderId as string, { status }).then(
        (res) => res.data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
  });

  if (!order) return null;

  const handleStatusChange = (status: OrderStatus) => {
    mutate(status);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: <Link to="/orders">Orders</Link> },
            { title: `Order #${order._id}` },
          ]}
        />
        <Space>
          <Typography.Text>Select Order Status</Typography.Text>
          <Select
            defaultValue={order.orderStatus}
            style={{ width: 150 }}
            onChange={handleStatusChange}
            options={orderStatusOptions}
          />
        </Space>
      </Flex>

      <Row gutter={24}>
        {/* Order Items */}
        <Col span={14}>
          <Card
            title="Order Items"
            extra={
              <Tag
                bordered={false}
                color={colorMapping[order.orderStatus] ?? 'processing'}
              >
                {capitalizeFirst(order.orderStatus)}
              </Tag>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={order.cart}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar shape="square" size={56} src={item.image} />
                    }
                    title={
                      <Typography.Text strong>{item.name}</Typography.Text>
                    }
                    description={item.chosenConfiguration.selectedToppings
                      ?.flat()
                      .map((t) => t.name)
                      .join(', ')}
                  />
                  <Space direction="vertical" align="end">
                    <Typography.Text strong>
                      {Object.values(
                        item.chosenConfiguration.priceConfiguration,
                      ).join(', ')}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      Qty: {item.qty}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Customer & Order Summary */}
        <Col span={10}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Customer Details */}
            <Card title="Customer Details">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Name">
                  {order.customerId.firstName} {order.customerId.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {order.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Order Summary */}
            <Card title="Order Summary">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Payment Status">
                  <Tag
                    color={order.paymentStatus === 'paid' ? 'green' : 'orange'}
                  >
                    {capitalizeFirst(order.paymentStatus)}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Order Amount">
                  <Typography.Text strong>₹ {order.total}</Typography.Text>
                </Descriptions.Item>

                <Descriptions.Item label="Order Time">
                  {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
                </Descriptions.Item>

                {order.comment && (
                  <Descriptions.Item label="Comment">
                    {order.comment}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Space>
        </Col>
      </Row>
    </Space>
  );
};

export default SingleOrder;
