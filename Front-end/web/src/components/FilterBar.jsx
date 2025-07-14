import { Form, Input, Select, Button, InputNumber, Space } from "antd";

const { Option } = Select;

export default function FilterBar({ fields, onFilter }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const cleaned = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== undefined && v !== "")
    );
    onFilter(cleaned);
  };

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  const renderField = ({ name, label, type, options, style, mode }) => {
    if (type === "text") return <Input placeholder={label} style={style} />;
    if (type === "number")
      return (
        <InputNumber placeholder={label} style={{ width: 120, ...style }} />
      );
    if (type === "select") {
      return (
        <Select
          placeholder={label}
          allowClear
          mode={mode}
          style={{ width: 140, ...style }}
        >
          {options.map((opt) => (
            <Option key={opt} value={opt}>
              {opt}
            </Option>
          ))}
        </Select>
      );
    }
    return null;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ marginBottom: 16, flexWrap: "wrap" }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          form.submit();
        }
      }}
    >
      {fields.map((field) => {
        if (field.type === "group") {
          return (
            <Form.Item
              label={field.label}
              key={field.label}
              style={{ marginRight: 16 }}
            >
              <Space>
                {field.children.map((child) => (
                  <Form.Item name={child.name} key={child.name} noStyle>
                    {renderField(child)}
                  </Form.Item>
                ))}
              </Space>
            </Form.Item>
          );
        } else {
          return (
            <Form.Item name={field.name} key={field.name}>
              {renderField(field)}
            </Form.Item>
          );
        }
      })}

      <Form.Item className="absolute right-4 bottom-0">
        <Button type="primary" htmlType="submit">
          Filter
        </Button>
      </Form.Item>
      <Form.Item className="absolute right-25 bottom-0">
        <Button onClick={handleReset}>Reset</Button>
      </Form.Item>
    </Form>
  );
}
