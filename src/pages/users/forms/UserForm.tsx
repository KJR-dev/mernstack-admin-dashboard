import { Card, Col, Form, Input, Row, Select, Space } from "antd"
import { getTenants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import type { Tenant } from "../../../types";

const UserForm = ({ isEditMode = false }: { isEditMode: boolean }) => {
  const selectedRole = Form.useWatch('role',)
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((res) => res.data);
    }
  });
  return <Row>
    <Col span={24}>
      <Space direction="vertical" size={"large"}>
        <Card title="Basic info">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="First name" name="firstName" rules={[
                {
                  required: true,
                  message: "First name is required"
                }
              ]}>
                <Input size='large' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last name" name="lastName" rules={[
                {
                  required: true,
                  message: "First name is required"
                }
              ]}>
                <Input size='large' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" name="email" rules={[
                {
                  required: true,
                  message: "Email name is required"
                },
                {
                  type: "email",
                  message: "Email is not valid"
                }
              ]}>
                <Input size='large' />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {!isEditMode && (
          <Card title="Security info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Password" name="password" rules={[
                  {
                    required: true,
                    message: "Password is required"

                  }
                ]}>
                  <Input type='password' size='large' />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )
        }


        <Card title="Auth info">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="Role" name="role" rules={[
                {
                  required: true,
                  message: "Role is required"
                }
              ]}>
                <Select style={{ width: '100%' }}
                  size="large"
                  allowClear={true}
                  onChange={() => { }}
                  placeholder="Select Role">
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {
              selectedRole === 'manager' && (
                <Col span={12}>
                  <Form.Item label="Tenant" name="tenantId" rules={[
                    {
                      required: true,
                      message: "Tenant is required"
                    }
                  ]}>
                    <Select style={{ width: '100%' }}
                      id="selectBoxInUserForm"
                      size="large"
                      allowClear={true}
                      onChange={() => { }}
                      placeholder="Select Tenant">
                      {tenants?.map((tenant: Tenant) =>
                      (<Select.Option key={tenant.id} value={tenant.id}>
                        {`${tenant.name}, ${tenant.address}`}
                      </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )
            }
            
          </Row>
        </Card>

      </Space>
    </Col>
    <Col></Col>
  </Row>
}

export default UserForm