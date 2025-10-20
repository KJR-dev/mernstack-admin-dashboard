import { Navigate, NavLink, Outlet } from "react-router-dom"
import { useAuthStore } from "../store"
import { Layout, Menu, theme } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Icon from "@ant-design/icons";
import { useState } from "react";
import Home from "../components/icon/Home";
import UserIcon from "../components/icon/UserIcon";
import { foodIcon } from "../components/icon/FoodIcon";
import BasketIcon from "../components/icon/BasketIcon";
import GiftIcon from "../components/icon/GiftIcon";
import Logo from "../components/icon/Logo";

const items = [
    {
        key: '/',
        icon: <Icon component={Home}/>,
        label: <NavLink to='/'>Home</NavLink>
    },
    {
        key: '/users',
        icon: <Icon component={UserIcon} />,
        label: <NavLink to='/users'>Users</NavLink>
    },
    {
        key: '/resturants',
        icon: <Icon component={foodIcon} />,
        label: <NavLink to='/resturants'>Resturants</NavLink>
    },
    {
        key: '/products',
        icon: <Icon component={BasketIcon} />,
        label: <NavLink to='/products'>Products</NavLink>
    },
    {
        key: '/promos',
        icon: <Icon component={GiftIcon} />,
        label: <NavLink to='/promos'>Promos</NavLink>
    },
]

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // protection
    const { user } = useAuthStore();
    if (user === null) {
        return <Navigate to="/auth/login" replace={true} />
    }
    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible theme="light" collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo">
                        <Logo />
                    </div>
                    <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={items} />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Mernspace pizza shop
                    </Footer>
                </Layout>
            </Layout>
            {/* <Outlet /> */}
        </div>
    )
}

export default Dashboard