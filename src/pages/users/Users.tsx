import { Breadcrumb } from "antd";
import { RightOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const Users = () => {
  return (
    <div>
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
    </div>
  )
}

export default Users