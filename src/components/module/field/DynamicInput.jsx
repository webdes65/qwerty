import { Form, Input } from "antd";

export default function DynamicInput({
  label,
  name,
  rules,
  placeholder,
  size,
  maxLength,
}) {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Input placeholder={placeholder} size={size} maxLength={maxLength} />
    </Form.Item>
  );
}
