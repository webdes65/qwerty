import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Modal, Form, Button } from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import { request } from "@services/apiService.js";

const CopyModal = ({
  isOpenChooseNameModal,
  setIsOpenChooseNameModal,
  title,
  formId,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "Name is required";
    return errors;
  };

  if (!formId) {
    setIsOpenChooseNameModal(false);
    return null;
  }

  const copyFormMutation = useMutation(
    (data) => {
      return request({
        method: "POST",
        url: "/api/forms/clone",
        data,
      });
    },
    {
      onSuccess: (data) => {
        toast.success("Form copied successfully!");
        setIsOpenChooseNameModal(false);
        if (onSuccess) {
          onSuccess(data);
        }
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.message || "Error copying form";
        toast.error(errorMessage);
      },
    },
  );

  const handleSubmit = (values, { resetForm }) => {
    if (!formId) {
      toast.error("Cannot copy form: Form ID is missing");
      return;
    }

    const payloadData = {
      name: values.name,
      form: formId,
    };

    copyFormMutation.mutate(payloadData);
    resetForm();
    navigate("/forms");
  };

  return (
    <Modal
      className="font-Quicksand"
      title={title}
      open={isOpenChooseNameModal}
      onCancel={() => setIsOpenChooseNameModal(false)}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: formikSubmit, setFieldValue, values }) => (
          <Form onFinish={formikSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col justify-center items-start">
              <label htmlFor="name" className="text-sm text-gray-500 font-bold">
                New Form Name
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
              loading={copyFormMutation.isLoading}
              className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
            >
              Copy Form
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CopyModal;
