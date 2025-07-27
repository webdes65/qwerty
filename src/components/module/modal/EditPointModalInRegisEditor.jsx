import { Modal, Slider } from "antd";
import { Field, Formik, Form } from "formik";

const EditPointModalInRegisEditor = ({
  isOpenEditModal,
  setIsOpenEditModal,
  item,
  items,
  setPoints,
}) => {
  return (
    <Modal
      className="font-Quicksand"
      title="Edit"
      open={isOpenEditModal}
      onCancel={() => setIsOpenEditModal(false)}
      footer={null}
    >
      <Formik
        initialValues={{
          bg: item?.bg,
          width: item?.width,
          height: item?.height,
          borderRadius: item?.borderRadius,
        }}
        onSubmit={(values) => {
          const updatedItems = [...items];
          const index = updatedItems.findIndex((index) => index.id === item.id);

          if (index !== -1) {
            updatedItems[index] = {
              ...updatedItems[index],
              ...values,
            };
          }

          setPoints(updatedItems);

          setIsOpenEditModal(false);
        }}
      >
        {({ values, handleChange, setFieldValue }) => (
          <Form className="flex flex-col gap-4 w-full">
            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 flex flex-col justify-center items-start">
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
              <div className="w-1/2 flex flex-col justify-center items-start">
                <label
                  htmlFor="height"
                  className="text-sm text-gray-500 font-bold"
                >
                  Height
                </label>
                <Field
                  type="number"
                  name="height"
                  className="border-2 border-gray-200 p-2 rounded w-full outline-none"
                  onChange={handleChange}
                  value={values.height}
                />
              </div>
            </div>

            <div className="w-full h-auto flex flex-col justify-center items-start gap-2">
              <label htmlFor="bg" className="text-sm text-gray-500 font-bold">
                Border Radius
              </label>
              <Slider
                className="w-full"
                min={0}
                max={50}
                step={1}
                value={values.borderRadius}
                onChange={(value) =>
                  handleChange({ target: { name: "borderRadius", value } })
                }
              />
            </div>

            <div className="flex flex-row justify-start items-center gap-2">
              <label htmlFor="bg" className="text-sm text-gray-500 font-bold">
                Background Color
              </label>

              <Field
                type="color"
                name="bg"
                className="shadow"
                onChange={(event) => setFieldValue("bg", event.target.value)}
                value={values.bg}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOpenEditModal(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditPointModalInRegisEditor;
