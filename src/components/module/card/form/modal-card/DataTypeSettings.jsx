import { Select } from "antd";
import { Field } from "formik";
const { Option } = Select;

const DataTypeSettings = ({ values, setFieldValue, props, setLabelBet }) => {
  if (!values.temp) return null;

  return (
    <>
      <Select
        className="customSelect ant-select-selector w-full"
        placeholder="Type data"
        onChange={(value) => setFieldValue("typeDataRegister", value)}
      >
        <Option value="string">String</Option>
        <Option value="binary">Binary</Option>
        <Option value="integer">Integer</Option>
        <Option value="float">Float</Option>
        <Option value="boolean">Boolean</Option>
      </Select>

      {values.typeDataRegister === "binary" && (
        <Select
          className="customSelect w-full"
          placeholder="Number bits"
          onChange={(value) => setFieldValue("numberBits", value)}
        >
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
          <Option value="6">6</Option>
          <Option value="7">7</Option>
          <Option value="8">8</Option>
          <Option value="9">9</Option>
          <Option value="10">10</Option>
          <Option value="11">11</Option>
          <Option value="12">12</Option>
          <Option value="13">13</Option>
          <Option value="14">14</Option>
          <Option value="15">15</Option>
          <Option value="16">16</Option>
        </Select>
      )}

      {values.typeDataRegister === "binary" && (
        <div className="flex flex-row justify-center items-center gap-1">
          <div className="w-1/2 flex flex-row justify-start items-center gap-2 p-2 bg-blue-50 dark:bg-gray-100 rounded-md">
            <Field
              type="checkbox"
              id="hideIfZero"
              name="hideIfZero"
              checked={values.hideIfZero}
              onChange={() => setFieldValue("hideIfZero", !values.hideIfZero)}
              className="w-4 h-4"
            />
            <label
              htmlFor="hideIfZero"
              className="text-sm cursor-pointer font-bold"
            >
              If 0, it's hidden.
            </label>
          </div>
          <div className="w-1/2 flex flex-row justify-start items-center gap-2 p-2 bg-blue-50 dark:bg-gray-100 rounded-md">
            <Field
              type="checkbox"
              id="hideIfOne"
              name="hideIfOne"
              checked={values.hideIfOne}
              onChange={() => setFieldValue("hideIfOne", !values.hideIfOne)}
              className="w-4 h-4"
            />
            <label
              htmlFor="hideIfOne"
              className="text-sm font-bold cursor-pointer"
            >
              If 1, it's hidden.
            </label>
          </div>
        </div>
      )}

      {(values.typeDataRegister === "integer" ||
        values.typeDataRegister === "binary") && (
        <div className="h-auto flex flex-row justify-center items-end gap-1">
          <Select
            className="customSelect w-full"
            placeholder="Condition definition"
            onChange={(value) => {
              if (setLabelBet) {
                  setLabelBet((prevState) => ({
                    ...prevState,
                    bet: value,
                 }))
              }else {
                  props.setLabelBetData((prevState) => ({
                      ...prevState,
                      bet: value,
                  }));
              }
            }}
          >
            <Option value="bigger">greater than &gt;</Option>
            <Option value="smaller">less than &lt;</Option>
            <Option value="equal">equal = </Option>
            <Option value="GreaterThanOrEqual">
              greater than or equal &gt;=
            </Option>
            <Option value="LessThanOrEqual">less than or equal &lt;=</Option>
          </Select>
        </div>
      )}
    </>
  );
};

export default DataTypeSettings;
