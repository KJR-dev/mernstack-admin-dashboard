import { RightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Descriptions,
  Flex,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import { format } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { colorMapping } from '../../constants';
import { getSingleOrder } from '../../http/api';
import type { Order } from '../../types';
import { capitalizeFirst } from '../products/forms/helper';

const { Text } = Typography;

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

  if (!order) return null;

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
        <Tag
          bordered={false}
          color={colorMapping[order.orderStatus] ?? 'processing'}
        >
          {capitalizeFirst(order.orderStatus)}
        </Tag>
      </Flex>

      <Row gutter={24}>
        {/* Order Items */}
        <Col span={14}>
          <Card title="Order Items" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={order.cart}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar shape="square" size={56} src={item.image} />
                    }
                    title={<Text strong>{item.name}</Text>}
                    description={item.chosenConfiguration.selectedToppings
                      ?.flat()
                      .map((t) => t.name)
                      .join(', ')}
                  />
                  <Space direction="vertical" align="end">
                    <Text strong>
                      {Object.values(
                        item.chosenConfiguration.priceConfiguration,
                      ).join(', ')}
                    </Text>
                    <Text type="secondary">Qty: {item.qty}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Customer & Order Info */}
        <Col span={10}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Customer Details */}
            <Card title="Customer Details" bordered={false}>
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
            <Card title="Order Summary" bordered={false}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Payment Status">
                  <Tag
                    color={order.paymentStatus === 'paid' ? 'green' : 'orange'}
                  >
                    {capitalizeFirst(order.paymentStatus)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Order Amount">
                  <Text strong>₹ {order.total}</Text>
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
