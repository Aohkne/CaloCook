import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Space,
  Radio,
  Modal,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;

export default function DishFilterBar({ onChange }) {
  const [form] = Form.useForm();
  const [showFilter, setShowFilter] = useState(false);

  const handleChange = () => {
    const values = form.getFieldsValue();
    onChange(values);
  };

  const handleReset = () => {
    form.resetFields();
    onChange({});
  };

  const handleModalCancel = () => {
    setShowFilter(false);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onValuesChange={handleChange}
      initialValues={{
        sortBy: "createdAt",
        order: "desc",
      }}
    >
      {/* Top row: Search + Sort */}
      <Row gutter={12} align="middle" wrap>
        <Col flex="auto">
          <Form.Item name="name" noStyle>
            <Input
              allowClear
              placeholder="Search dish name..."
              prefix={<SearchOutlined />}
              onPressEnter={handleChange}
            />
          </Form.Item>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFilter(true)}
            >
              Filters
            </Button>
            <Form.Item name="sortBy" noStyle>
              <Select style={{ width: 130 }}>
                <Option value="name">Name</Option>
                <Option value="cookingTime">Cooking Time</Option>
                <Option value="calorie">Calorie</Option>
                <Option value="createdAt">Created At</Option>
              </Select>
            </Form.Item>
            <Form.Item name="order" noStyle>
              <Select style={{ width: 90 }}>
                <Option value="asc">Asc</Option>
                <Option value="desc">Desc</Option>
              </Select>
            </Form.Item>
          </Space>
        </Col>
      </Row>

      {/* Filter Modal */}
      <Modal
        title="Advanced Filters"
        open={showFilter}
        onCancel={handleModalCancel}
        footer={[
          <Button key="reset" onClick={handleReset}>
            Reset
          </Button>,
        ]}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Min Cooking Time" name="minCookingTime">
              <Input type="number" placeholder="Min minutes" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Max Cooking Time" name="maxCookingTime">
              <Input type="number" placeholder="Max minutes" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Min Calorie" name="minCalorie">
              <Input type="number" placeholder="Min kcal" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Max Calorie" name="maxCalorie">
              <Input type="number" placeholder="Max kcal" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Difficulty" name="difficulty">
              <Select
                mode="multiple"
                allowClear
                placeholder="Select difficulty"
              >
                <Option value="easy">Easy</Option>
                <Option value="medium">Medium</Option>
                <Option value="hard">Hard</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Is Active" name="isActive" initialValue={null}>
              <Radio.Group>
                <Radio.Button value={null}>All</Radio.Button>
                <Radio.Button value={true}>Active</Radio.Button>
                <Radio.Button value={false}>Banned</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </Form>
  );
}
