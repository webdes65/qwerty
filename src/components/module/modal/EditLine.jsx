import { Button, Modal } from "antd";
import { Formik, Form, Field } from "formik";

const EditLine = ({
  isOpenEditLineModal,
  setIsOpenEditLineModal,
  lineInfo,
  lines,
  setLines,
}) => {
  const handleSubmit = (values) => {
    const updatedLines = [...lines];
    let found = false;

    updatedLines.forEach((lineGroup, groupIndex) => {
      lineGroup.forEach((line, lineIndex) => {
        if (line.id === lineInfo.index) {
          updatedLines[groupIndex][lineIndex].color = values.color;
          updatedLines[groupIndex][lineIndex].width = values.width;
          found = true;
        }
      });
    });

    if (found) {
      setLines(updatedLines);
      setIsOpenEditLineModal(false);
    } else {
      console.log("خط مورد نظر پیدا نشد!");
    }
  };

  return (
    <Modal
      className="font-Quicksand"
      title="Edit Line"
      open={isOpenEditLineModal}
      onCancel={() => setIsOpenEditLineModal(false)}
      footer={null}
    >
      <Formik
        initialValues={{
          color: lineInfo?.color || "#000",
          width: lineInfo?.width || 2,
        }}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="flex flex-col gap-4 w-full">
            <div className="flex flex-row justify-start items-center gap-2">
              <label htmlFor="bg" className="text-sm text-gray-500 font-bold">
                Background Color
              </label>

              <Field
                type="color"
                name="color"
                className="shadow"
                onChange={(event) => setFieldValue("color", event.target.value)}
                value={values.color}
              />
            </div>
            <div className="w-full flex flex-col justify-center items-start">
              <label
                htmlFor="width"
                className="text-sm text-gray-500 font-bold"
              >
                Width
              </label>
              <Field
                type="number"
                name="width"
                className="border-2 border-gray-200 p-2 rounded w-full outline-none"
                onChange={handleChange}
                value={values.width}
              />
            </div>
            <Button
              htmlType="submit"
              className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditLine;
