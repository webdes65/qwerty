import { Modal, Form, Button } from "antd";
import { Formik, Field, ErrorMessage } from "formik";

const ChooseNameModal = ({
  isOpenChooseNameModal,
  setIsOpenChooseNameModal,
  setName,
  title,
}) => {
  const initialValues = {
    name: "",
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) errors.name = "Name is required";

    return errors;
  };

  return (
    <Modal
      className="font-Quicksand"
      title={`Choose Name ${title}`}
      open={isOpenChooseNameModal}
      onCancel={() => setIsOpenChooseNameModal(false)}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, { resetForm }) => {
          setName(values.name);
          setIsOpenChooseNameModal(false);
          resetForm();
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <Form onFinish={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col justify-center items-start">
              <label htmlFor="name" className="text-sm text-gray-500 font-bold">
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="border-2 border-gray-200 p-2 rounded w-full outline-none"
                onChange={(e) => setFieldValue("name", e.target.value)}
                value={values.name}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-[0.80rem] font-medium"
              />
            </div>

            <Button
              htmlType="submit"
              className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ChooseNameModal;
