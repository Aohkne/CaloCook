import { Form, Input, Select, Button } from "antd";

const { Option } = Select;

/**
 * props.fields = [
 *   { name: 'username', label: 'Username', type: 'text' },
 *   { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard'] },
 *   { name: 'isActive', label: 'Active', type: 'select', options: ['true', 'false'] }
 * ]
 */
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

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={handleFinish}
      style={{ marginBottom: 16, flexWrap: "wrap" }}
    >
      {fields.map(({ name, label, type, options }) => (
        <Form.Item name={name} key={name}>
          {type === "text" && <Input placeholder={label} />}
          {type === "select" && (
            <Select placeholder={label} allowClear style={{ minWidth: 120 }}>
              {options.map((opt) => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      ))}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Filter
        </Button>
      </Form.Item>
      <Form.Item>
        <Button onClick={handleReset}>Reset</Button>
      </Form.Item>
    </Form>
  );
}
