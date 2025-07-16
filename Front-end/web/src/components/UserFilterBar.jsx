import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Space,
  Modal,
  Radio,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;

export default function UserFilterBar({ onChange }) {
  const [form] = Form.useForm();
  const [showFilter, setShowFilter] = useState(false);

  const handleReset = () => {
    form.resetFields();
    onChange({});
    setShowFilter(false);
  };

  const handleSearchEnter = (e) => {
    e.preventDefault();
    const values = form.getFieldsValue();
    onChange(values);
  };

  const handleSortChange = () => {
    const values = form.getFieldsValue();
    onChange(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        sortBy: "createdAt",
        order: "desc",
      }}
      onValuesChange={() => {
        const values = form.getFieldsValue();
        onChange(values);
      }}
    >
      {/* Top row: Search + Sort */}
      <Row gutter={12} align="middle" wrap>
        <Col flex="auto">
          <Form.Item name="username" noStyle>
            <Input
              allowClear
              placeholder="Search username or email..."
              prefix={<SearchOutlined />}
              onPressEnter={handleSearchEnter}
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
              <Select style={{ width: 140 }} onChange={handleSortChange}>
                <Option value="username">Username</Option>
                <Option value="email">Email</Option>
                <Option value="createdAt">Created At</Option>
              </Select>
            </Form.Item>
            <Form.Item name="order" noStyle>
              <Select style={{ width: 90 }} onChange={handleSortChange}>
                <Option value="asc">Asc</Option>
                <Option value="desc">Desc</Option>
              </Select>
            </Form.Item>
          </Space>
        </Col>
      </Row>

      {/* Filter Modal */}
      <Modal
        title="User Filters"
        open={showFilter}
        onCancel={() => setShowFilter(false)}
        footer={[
          <Button key="reset" onClick={handleReset}>
            Reset
          </Button>,
        ]}
      >
        <Form.Item label="Is Active" name="isActive" initialValue={null}>
          <Radio.Group>
            <Radio.Button value={null}>All</Radio.Button>
            <Radio.Button value={true}>Active</Radio.Button>
            <Radio.Button value={false}>Banned</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Modal>
    </Form>
  );
}
