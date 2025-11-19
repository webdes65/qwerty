import { ColorPicker, Form } from "antd";

export default function DynamicColorPicker({
  label,
  data,
  color,
  setColor,
  size,
  presets,
}) {
  return (
    <Form.Item
      label={label}
      required
      className={data?.type !== "marker" ? "w-2/4" : "w-full"}
    >
      <div className="flex items-center gap-3">
        <ColorPicker
          value={color}
          onChange={setColor}
          showText
          size={size}
          presets={presets}
        />
      </div>
    </Form.Item>
  );
}
