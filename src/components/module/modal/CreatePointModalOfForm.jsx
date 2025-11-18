import { Button, Modal, Slider } from "antd";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { v4 as uuidv4 } from "uuid";
import "@styles/formAndComponentStyles.css";

const CreatePointModalOfForm = ({
  isOpenModalCreatePoint,
  setIsOpenModalCreatePoint,
  points,
  setPoints,
}) => {
  const initialValues = {
    type: "point",
    name: "",
    width: 10,
    height: 10,
    bg: "#000",
    position: { x: 0, y: 0 },
    borderRadius: 5,
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name is required";
    }
    return errors;
  };

  return (
    <Modal
      className="font-Quicksand"
      title="Create Point"
      open={isOpenModalCreatePoint}
      onCancel={() => setIsOpenModalCreatePoint(false)}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, { resetForm }) => {
          const newPoint = {
            ...values,
            id: uuidv4(),
          };
          const updatedList = [...points, newPoint];
          setPoints(updatedList);
          resetForm();
          setIsOpenModalCreatePoint(false);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="w-full flex flex-col gap-4">
            <div className="flex flex-col justify-center items-start">
              <label htmlFor="name" className="text-sm dragLabelStyle">
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="w-full inputStyle"
                onChange={(e) => setFieldValue("name", e.target.value)}
                value={values.name}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-[0.80rem] font-medium mt-1"
              />
            </div>

            <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
              <div className="w-1/2 flex flex-col justify-center items-start">
                <label htmlFor="width" className="text-sm dragLabelStyle">
                  Width
                </label>
                <Field
                  type="number"
                  name="width"
                  className="w-full inputStyle"
                  onChange={(e) => setFieldValue("width", e.target.value)}
                  value={values.width}
                />
              </div>
              <div className="w-1/2 flex flex-col justify-center items-start">
                <label htmlFor="height" className="text-sm dragLabelStyle">
                  Height
                </label>
                <Field
                  type="number"
                  name="height"
                  className="w-full inputStyle"
                  onChange={(e) => setFieldValue("height", e.target.value)}
                  value={values.height}
                />
              </div>
            </div>

            <div className="flex flex-row justify-start items-center gap-2">
              <label htmlFor="bg" className="text-sm dragLabelStyle">
                Background Color
              </label>
              <Field
                type="color"
                name="bg"
                className="shadow"
                onChange={(e) => setFieldValue("bg", e.target.value)}
                value={values.bg}
              />
            </div>

            <div className="w-full h-auto flex flex-col justify-center items-start gap-2">
              <label htmlFor="bg" className="text-sm dragLabelStyle">
                Border Radius
              </label>
              <Slider
                className="w-full"
                min={0}
                max={50}
                step={1}
                value={values.borderRadius}
                onChange={(value) => setFieldValue("borderRadius", value)}
              />
            </div>

            <Button htmlType="submit" className="w-full buttonPrimaryStyle">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreatePointModalOfForm;
