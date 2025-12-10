import { Card, Col, Form, Input, Row } from 'antd'

export const TenantForm = () => {
    return <Row>
        <Col span={24}>
            <Card title="Basic info">
                <Row gutter={20}>
                    <Col span={12}>
                        <Form.Item label="Name" name="name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Address" name="address">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </Col>
    </Row>
}
