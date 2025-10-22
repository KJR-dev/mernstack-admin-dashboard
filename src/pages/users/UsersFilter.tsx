import { Card, Col, Input, Row, Select } from "antd";

type userFilterProps = {
    children?: React.ReactNode;
    onFilterChange: (filterName: string, filterValue: string) => void;
}
const UsersFilter = ({ onFilterChange, children }: userFilterProps) => {
    return (
        <Card style={{ width: "100%" }}>
            <Row justify={"space-between"}>
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Input.Search placeholder="Search" allowClear={true} onChange={(e) => onFilterChange('searchFilter', e.target.value)} />
                        </Col>
                        <Col span={8}>
                            <Select style={{ width: '100%' }}
                                allowClear={true}
                                onChange={(seletedItem) => onFilterChange('roleFilter', seletedItem)}
                                placeholder="Select role" >
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="manager">Manager</Select.Option>
                                <Select.Option value="customer">Customer</Select.Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select style={{ width: '100%' }}
                                allowClear={true}
                                onChange={(seletedItem) => onFilterChange('statusFilter', seletedItem)}
                                placeholder="Status">
                                <Select.Option value="active">Active</Select.Option>
                                <Select.Option value="banned">Banned</Select.Option>
                            </Select>
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

export default UsersFilter