import { Form, Input } from "antd";

export default function DynamicTextArea({
  label,
  name,
  rules,
  placeholder,
  rows,
  maxLength,
}) {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Input.TextArea
        rows={rows}
        showCount
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </Form.Item>
  );
}
