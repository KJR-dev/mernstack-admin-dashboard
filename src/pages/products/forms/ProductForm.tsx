import { Row, Col, Space, Card, Input, Select, Form, Upload, Typography, Switch, type UploadProps, message } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import type { Category, Tenant } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import { useState } from "react";

const ProductForm = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const selectedCategory = Form.useWatch('categoryId');

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            return await getCategories().then((res) => res.data);
        }
    })

    const { data: tenants } = useQuery({
        queryKey: ["tenants"],
        queryFn: async () => {
            return await getTenants('perPage=100&currentPage=1').then((res) => res.data);
        },
    });

    const uploaderConfig: UploadProps = {
        name: 'file',
        showUploadList: false,
        multiple: false,
        beforeUpload: (file: File) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                messageApi.error("You can only upload .jpg or .png file!")
            }
            setImageUrl(URL.createObjectURL(file));
            return false;
        }
    };

    return <Row>
        <Col span={24}>
            <Space direction="vertical" size={"large"}>
                <Card title="Product info">
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label="Product name" name="name" rules={[
                                {
                                    required: true,
                                    message: "Product name is required"
                                }
                            ]}>
                                <Input size='large' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Category" name="categoryId" rules={[
                                {
                                    required: true,
                                    message: "Category is required"
                                }
                            ]}>
                                <Select
                                    size="large"
                                    style={{ width: '100%' }}
                                    allowClear={true}
                                    onChange={() => { }}
                                    placeholder="Select category"
                                >
                                    {categories?.map((category: Category) => (
                                        <Select.Option value={JSON.stringify(category)} key={category._id}>
                                            {`${category.name}`}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Description" name="description" rules={[
                                {
                                    required: true,
                                    message: "description name is required"
                                },
                            ]}>
                                <Input.TextArea rows={2} maxLength={100} style={{ resize: "none" }} size='large' />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title="Product image">
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item label="" name="image" rules={[
                                {
                                    required: true,
                                    message: "Please upload a product image"
                                }
                            ]}>
                                {contextHolder}
                                <Upload listType="picture-card" {...uploaderConfig}>
                                    {
                                        imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', height:'100%' }} /> : (
                                            <Space direction="vertical">
                                                <PlusOutlined />
                                                <Typography.Text>Upload</Typography.Text>
                                            </Space>
                                        )
                                    }
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
                {selectedCategory && <Attributes selectedCategory={selectedCategory} />}

                <Card title="Tenant info">
                    <Row gutter={24}>
                        <Col span={24}>
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
                                    placeholder="Select Tenant"
                                >
                                    {tenants?.data.map((tenant: Tenant) =>
                                    (<Select.Option key={tenant.id} value={tenant.id}>
                                        {`${tenant.name}, ${tenant.address}`}
                                    </Select.Option>)
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title="Other properties">
                    <Row gutter={24}>
                        <Col span={24}>
                            <Space>
                                <Form.Item name="isPublish">
                                    <Switch defaultChecked={false} onChange={() => { }} checkedChildren="Yes" unCheckedChildren="No" />
                                </Form.Item>
                                <Typography.Text style={{ marginBottom: 22, display: 'block' }}>Published</Typography.Text>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </Col>
        <Col></Col>
    </Row>
}

export default ProductForm;