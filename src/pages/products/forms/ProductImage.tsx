import { Form, message, Space, Typography, Upload, type UploadProps } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useState } from "react";


const ProductImage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

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

    return (
        <Form.Item label="" name="image" rules={[
            {
                required: true,
                message: "Please upload a product image"
            }
        ]}>
            <Upload listType="picture-card" {...uploaderConfig}>
                {contextHolder}
                {
                    imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%' }} /> : (
                        <Space direction="vertical">
                            <PlusOutlined />
                            <Typography.Text>Upload</Typography.Text>
                        </Space>
                    )
                }
            </Upload>
        </Form.Item>
    )
}

export default ProductImage