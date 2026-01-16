import { RightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
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

const SingleOrder = () => {
  const params = useParams();
  const orderId = params.orderId;
  const { data: order } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => {
      const queryString = new URLSearchParams({
        fields:
          'cart,address,paymentMode,tenantId,total,comment,paymentStatus,orderStatus,createdAt',
      }).toString();
      return getSingleOrder(orderId as string, queryString).then(
        (res) => res.data,
      );
    },
  });

  if (!order) {
    return;
  }

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
                title: <Link to="/orders">Orders</Link>,
              },
              {
                title: `Order #${order?._id}`,
              },
            ]}
          />
        </Flex>
        <Row gutter={24}>
          <Col span={14}>
            <Card
              title="Order Details"
              extra={
                <Tag
                  bordered={false}
                  color={colorMapping[order?.orderStatus] ?? 'processing'}
                >
                  {capitalizeFirst(order?.orderStatus)}
                </Tag>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={order.cart}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} />}
                      title={item.name}
                      description={item.chosenConfiguration.selectedToppings
                        ?.flat()
                        .map((topping) => topping.name)
                        .join(', ')}
                    />
                    <Space size="large">
                      <Typography.Text>
                        {Object.values(
                          item.chosenConfiguration.priceConfiguration,
                        ).join(', ')}
                      </Typography.Text>
                      <Typography.Text>
                        {item.qty} Items{item.qty > 1 ? 's' : ''}
                      </Typography.Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={10}>
            <Card title="Customer Details">
              <Space direction="vertical">
                <Flex style={{ flexDirection: 'column' }}>
                  <Typography.Text type="secondary">Name</Typography.Text>
                  <Typography.Text type="secondary">
                    {order.customerId.firstName +
                      ' ' +
                      order.customerId.lastName}
                  </Typography.Text>
                </Flex>
                <Flex style={{ flexDirection: 'column' }}>
                  <Typography.Text type="secondary">Address</Typography.Text>
                  <Typography.Text type="secondary">
                    {order.address}
                  </Typography.Text>
                </Flex>
                <Flex style={{ flexDirection: 'column' }}>
                  <Typography.Text type="secondary">
                    Payment Status
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {capitalizeFirst(order.paymentStatus)}
                  </Typography.Text>
                </Flex>
                <Flex style={{ flexDirection: 'column' }}>
                  <Typography.Text type="secondary">
                    Order Amount
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    ₹ {order.total}
                  </Typography.Text>
                </Flex>
                <Flex style={{ flexDirection: 'column' }}>
                  <Typography.Text type="secondary">Order Time</Typography.Text>
                  <Typography.Text type="secondary">
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                  </Typography.Text>
                </Flex>
                <Flex style={{ flexDirection: 'column' }}>
                  <Typography.Text type="secondary">Comment</Typography.Text>
                  <Typography.Text type="secondary">
                    {order.comment}
                  </Typography.Text>
                </Flex>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </>
  );
};

export default SingleOrder;
