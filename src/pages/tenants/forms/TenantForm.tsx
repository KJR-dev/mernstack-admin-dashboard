import { Card, Col, Form, Input, Row } from 'antd'

export const TenantForm = () => {
    return <Row>
        <Col span={24}>
            <Card title="Basic info">
                <Row gutter={20}>
                    <Col span={18}>
                        <Form.Item label="Name" name="name" rules={[
                            {
                                required: true,
                                message: "Name is required"
                            }
                        ]}>
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={18}>
                        <Form.Item label="Address" name="address" rules={[
                            {
                                required: true,
                                message: "Address is required"
                            }
                        ]}>
                            <Input size="large" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </Col>
    </Row>
}
