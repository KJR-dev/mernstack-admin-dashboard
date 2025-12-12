import { Card, Col, Form, Input, Row } from "antd"

type tenantFilterProps = {
    children?: React.ReactNode;
}
const TenantsFilter = ({ children }: tenantFilterProps) => {
    return (
        <Card style={{ width: "100%" }}>
            <Row>
                <Col span={16}>
                    <Row>
                        <Col span={8}>
                            <Form.Item name="q">
                                <Input.Search placeholder="Search" allowClear={true} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default TenantsFilter