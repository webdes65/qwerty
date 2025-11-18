import { Field } from "formik";
import { Select, Slider } from "antd";
import "@styles/formAndComponentStyles.css";

export default function BasicOPropertiesField({
  values,
  setFieldValue,
  handleChange,
  item,
}) {
  const optionsDecimalPlaces = [
    { label: "0", value: "0" },
    { label: "0.0", value: "1" },
    { label: "0.00", value: "2" },
    { label: "0.000", value: "3" },
    { label: "0.0000", value: "4" },
    { label: "0.00000", value: "5" },
    { label: "0.000000", value: "6" },
  ];

  return (
    <>
      {values.type === "button" && (
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm" htmlFor="titlebtn">
            Button Title
          </label>
          <Field
            name="titlebtn"
            type="text"
            placeholder="Enter button title"
            className="w-full mt-1 inputStyle"
            value={values.titlebtn}
            onChange={handleChange}
          />
        </div>
      )}

      {values.type !== "button" && (
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm" htmlFor="title">
            Title
          </label>
          <Field
            name="title"
            type="text"
            placeholder="Title"
            className="w-full mt-1 inputStyle"
            value={values.title}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="w-full flex flex-row justify-center items-center gap-2">
        <label className="text-sm w-1/2">
          Height
          <Field
            name="height"
            type="number"
            placeholder="Enter height"
            className="w-full mt-1 inputStyle"
            value={values.height}
            onChange={handleChange}
          />
        </label>
        <label className="text-sm w-1/2">
          Width
          <Field
            name="width"
            type="number"
            placeholder="Enter width"
            className="w-full mt-1 inputStyle"
            value={values.width}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="w-full flex flex-row justify-center items-center gap-2">
        <label className="text-sm w-1/2">
          Opacity
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={values.opacity}
            onChange={(value) => setFieldValue("opacity", value)}
          />
        </label>
        <label className="text-sm w-1/2">
          Border Radius (%)
          <Slider
            min={0}
            max={100}
            step={1}
            value={values.rounded || 0}
            onChange={(value) => {
              setFieldValue("rounded", value);
            }}
          />
        </label>
      </div>

      <div className="w-full flex flex-row justify-center items-center gap-2">
        <label className="text-sm w-1/2">
          Rotation
          <Slider
            min={0}
            max={180}
            step={1}
            value={values.rotation}
            onChange={(value) => setFieldValue("rotation", value)}
          />
        </label>

        <label className="text-sm w-1/2">
          Border Width
          <Slider
            min={0}
            max={10}
            step={1}
            value={values.borderWidth}
            onChange={(value) => setFieldValue("borderWidth", value)}
          />
        </label>
      </div>

      {item.type === "label" && (
        <div className="text-sm w-full flex flex-col justify-center items-start gap-1">
          <label htmlFor="title">Display Decimal Places</label>
          <Select
            className="customSelect w-full font-Quicksand h-[2.60rem] font-medium"
            options={optionsDecimalPlaces}
            defaultValue={optionsDecimalPlaces.find(
              (option) => option.value === String(values.decimalPlaces),
            )}
            onChange={(value) => setFieldValue("decimalPlaces", value)}
          />
        </div>
      )}
    </>
  );
}
