import { Field } from "formik";
import { Select } from "antd";
import "@styles/allRepeatStyles.css";

export default function StylePropertiesField({
  values,
  setFieldValue,
  handleChange,
}) {
  const fontOptions = [
    { label: "Azeret Mono", value: "Azeret Mono" },
    { label: "Noto Serif Toto", value: "Noto Serif Toto" },
    { label: "Edu SA Beginner", value: "Edu SA Beginner" },
    { label: "Digital", value: "DS-Digital" },
    { label: "IranSans", value: "IranSans" },
  ];

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center gap-4">
        <label className="text-sm w-4/12">
          backgroundColor
          <input
            type="color"
            name="backgroundColor"
            value={values.backgroundColor}
            onChange={(e) => setFieldValue("backgroundColor", e.target.value)}
            className="w-full mt-1"
          />
          <input
            type="text"
            placeholder="#ffffff"
            value={values.backgroundColor}
            onChange={(e) => setFieldValue("backgroundColor", e.target.value)}
            className="w-full mt-1 text-center cursor-text inputStyle"
          />
        </label>

        <label className="text-sm w-4/12">
          Border Color
          <input
            type="color"
            name="borderColor"
            value={values.borderColor}
            onChange={(e) => setFieldValue("borderColor", e.target.value)}
            className="w-full mt-1"
          />
          <input
            type="text"
            placeholder="#ffffff"
            value={values.borderColor}
            onChange={(e) => setFieldValue("borderColor", e.target.value)}
            className="w-full mt-1 text-center cursor-text inputStyle"
          />
        </label>

        <label className="text-sm w-4/12">
          Text Color
          <input
            type="color"
            name="textColor"
            value={values.textColor}
            onChange={(e) => setFieldValue("textColor", e.target.value)}
            className="w-full mt-1"
          />
          <input
            type="text"
            placeholder="#ffffff"
            value={values.textColor}
            onChange={(e) => setFieldValue("textColor", e.target.value)}
            className="w-full mt-1 text-center cursor-text inputStyle"
          />
        </label>
      </div>

      <div className="w-full flex flex-row justify-center items-center gap-2">
        <label className="text-sm w-1/2">
          Font Size
          <Field
            name="fontSize"
            type="number"
            placeholder="Enter font size"
            className="w-full mt-1 cursor-text inputStyle"
            value={values.fontSize}
            onChange={handleChange}
          />
        </label>

        <label className="text-sm h-full flex flex-col justify-between items-start w-1/2">
          Font Family
          <Select
            className="customSelect ant-select-selector h-[2.60rem] w-full"
            value={values.fontFamily}
            onChange={(value) => setFieldValue("fontFamily", value)}
            options={fontOptions.map((option) => ({
              value: option.value,
              label: (
                <span style={{ fontFamily: option.value }}>{option.label}</span>
              ),
            }))}
            placeholder="Select Font"
          />
        </label>
      </div>
    </>
  );
}
