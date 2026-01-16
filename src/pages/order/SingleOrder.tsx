import { RightOutlined } from '@ant-design/icons';
import { Breadcrumb, Flex, Space } from 'antd';
import { Link } from 'react-router-dom';

const SingleOrder = () => {
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
                title: 'Order #23561367813689',
              },
            ]}
          />
        </Flex>
      </Space>
    </>
  );
};

export default SingleOrder;
