import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd";
import { getCategories, getTenants } from "../../http/api";
import type { Category, Tenant } from "../../types";

type ProductsFilterProps = {
    children?: React.ReactNode;
}

const ProductsFilter = ({ children }: ProductsFilterProps) => {
    const { data: tenants } = useQuery({
        queryKey: ["tenants"],
        queryFn: async () => {
            return await getTenants('perPage=100&currentPage=1').then((res) => res.data);
        }
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            return await getCategories().then((res) => res.data);
        }
    })

    return (
        <Card>
            <Row justify="space-between">
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item name="query">
                                <Input.Search placeholder="Search" allowClear={true} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="categoryId">
                                <Select style={{ width: '100%' }}
                                    allowClear={true}
                                    placeholder="Select category" >
                                    {
                                        categories?.map((category: Category) => {
                                            return <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="tenantId">
                                <Select style={{ width: '100%' }}
                                    allowClear={true}
                                    placeholder="tenant" >
                                    {
                                        tenants?.data?.map((tenant: Tenant) => {
                                            return <Select.Option key={tenant.id} value={tenant.id}>{tenant.name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Space>
                                <Form.Item name="isPublish">
                                    <Switch defaultChecked={false} onChange={() => { }} />
                                </Form.Item>
                                <div style={{ marginBottom: 24 }}>
                                    <Typography.Text>Only show published</Typography.Text>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
                    {(children)}</Col>
            </Row>
        </Card>
    )
}

export default ProductsFilter