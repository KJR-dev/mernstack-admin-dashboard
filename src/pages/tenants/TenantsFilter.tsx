import { Card, Col, Input, Row } from "antd"

type tenantFilterProps = {
    children?: React.ReactNode;
    onFilterChange: (filterName: string, filterValue: string) => void;
}
const TenantsFilter = ({ onFilterChange, children }: tenantFilterProps) => {
    return (
        <Card style={{ width: "100%" }}>
            <Row>
                <Col span={16}>
                    <Row>
                        <Col span={8}>
                            <Input.Search placeholder="Search" allowClear={true} onChange={(e) => onFilterChange('searchFilter', e.target.value)} />
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