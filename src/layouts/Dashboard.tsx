import { Navigate, NavLink, Outlet } from "react-router-dom"
import { useAuthStore } from "../store"
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, theme } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Icon, { BellFilled } from "@ant-design/icons";
import { useState } from "react";
import Home from "../components/icon/Home";
import UserIcon from "../components/icon/UserIcon";
import { foodIcon } from "../components/icon/FoodIcon";
import BasketIcon from "../components/icon/BasketIcon";
import GiftIcon from "../components/icon/GiftIcon";
import Logo from "../components/icon/Logo";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";

const getMenuItems = (role: string) => {
    const baseItems = [
        {
            key: '/',
            icon: <Icon component={Home} />,
            label: <NavLink to='/'>Home</NavLink>
        },
        {
            key: '/tenants',
            icon: <Icon component={foodIcon} />,
            label: <NavLink to='/tenants'>Tenants</NavLink>
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
    ];
    if (role === "admin") {
        const menus = [...baseItems];
        menus.splice(1, 0, {
            key: '/users',
            icon: <Icon component={UserIcon} />,
            label: <NavLink to='/users'>Users</NavLink>
        });
        return menus;
    }
    return baseItems;
}

const Dashboard = () => {
    const { logout: logoutFromStore } = useAuthStore();
    const { mutate: logoutMutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: async () => {
            logoutFromStore();
            return;
        }
    });
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // protection
    const { user } = useAuthStore();
    if (user === null) {
        return <Navigate to="/auth/login" replace={true} />
    }
    const items = getMenuItems(user.role);
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
                    <Header style={{ paddingLeft: '16px', paddingRight: '16px', background: colorBgContainer }} >
                        {/* Here add header code */}
                        <Flex gap="middle" align="start" justify="space-between">
                            <Badge text={user.role === "admin" ? "You are an admin" : `${user?.tenant?.name} ,${user?.tenant?.address}`} status="success" />
                            <Space size={16}>
                                <Badge dot={true}>
                                    <BellFilled />
                                </Badge>
                                <Dropdown menu={{
                                    items: [
                                        {
                                            key: "logout",
                                            label: "Logout",
                                            onClick: () => {
                                                logoutMutate();
                                                return;
                                            }
                                        }
                                    ]
                                }} placement="bottomRight">
                                    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar>
                                </Dropdown>
                            </Space>
                        </Flex>
                    </Header >
                    <Content style={{ margin: '24px' }}>
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