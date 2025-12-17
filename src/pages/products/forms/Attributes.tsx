import { Card, Col, Form, Radio, Row, Switch, Typography } from "antd";
import type { Category } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";

type PricingProp = {
    selectedCategory: string;
}

const Attributes = ({ selectedCategory }: PricingProp) => {
    const { data: fetchedCategory } = useQuery<Category>({
        queryKey: ['category', selectedCategory],
        queryFn: () => {
            return getCategory(selectedCategory).then((res) => res.data)
        },
        staleTime: 1000 * 60 * 5,
    })

    if (!fetchedCategory?.attributes) {
        return null;
    }
    return <Card title={<Typography.Text>Attributes</Typography.Text>} variant="borderless">
        {fetchedCategory.attributes.map((attribute) => {
            return (
                <div key={attribute.name}>
                    {
                        attribute.widgetType === "radio"
                            ? (
                                <Form.Item
                                    label={attribute.name}
                                    name={['attributes', attribute.name]}
                                    initialValue={attribute.defaultValue}
                                    rules={[
                                        {
                                            required: true,
                                            message: `${attribute.name} is required`
                                        }
                                    ]}
                                >
                                    <Radio.Group>
                                        {
                                            attribute.availableOptions.map((option) => {
                                                return (
                                                    <Radio.Button value={option} key={option}>
                                                        {option}
                                                    </Radio.Button>
                                                )
                                            })
                                        }
                                    </Radio.Group>
                                </Form.Item>
                            )
                            : attribute.widgetType === "switch"
                                ? (
                                    <Row>
                                        <Col>
                                            <Form.Item
                                                label={attribute.name}
                                                name={['attributes', attribute.name]}
                                                valuePropName="checked"
                                                initialValue={attribute.defaultValue}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: `${attribute.name} is required`
                                                    }
                                                ]}
                                            >
                                                <Switch checkedChildren="Yes" unCheckedChildren="No">

                                                </Switch>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )
                                : null
                    }
                </div>
            )
        })}
    </Card>
}

export default Attributes