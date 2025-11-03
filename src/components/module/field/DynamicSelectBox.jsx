import { Form, Select } from "antd";

export default function DynamicSelectBox({
  label,
  name,
  rules,
  initialValue,
  mode,
  maxCount,
  showSearch,
  placeholder,
  optionFilterProp,
  allowClear,
  options,
  value,
  onChange,
  suffixIcon,
  filterOption,
  tokenSeparators,
}) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      initialValue={initialValue}
    >
      <Select
        mode={mode}
        maxCount={maxCount}
        showSearch={showSearch}
        className="customSelect w-full font-Quicksand"
        placeholder={placeholder}
        optionFilterProp={optionFilterProp}
        allowClear={allowClear}
        options={options}
        value={value}
        onChange={onChange}
        suffixIcon={suffixIcon}
        filterOption={filterOption}
        tokenSeparators={tokenSeparators}
      />
    </Form.Item>
  );
}
