import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Modal, Form, Button, Select } from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

const CopyModal = ({
  isOpenChooseNameModal,
  setIsOpenChooseNameModal,
  optionsCategories,
  title,
  formId,
  onSuccess,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
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
        navigate("/forms");
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
      category: selectedCategory,
    };

    copyFormMutation.mutate(payloadData);
    resetForm();
  };

  // console.log('optionsCategories', optionsCategories)

  const processedOptions = (optionsCategories ?? []).map((option) => ({
    ...option,
    value: option.value,
  }));

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/categories", data }),
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        queryClient.invalidateQueries("getCategories");

        setCategoryTitle("");
        setCategoryDescription("");
        setIsCreatingCategory(false);
      },
      onError: (error) => {
        logger.error(error);
      },
      onSettled: () => {
        setLoadingCreateCategory(false);
      },
    },
  );

  const handleCreateCategory = () => {
    const newCategory = {
      title: categoryTitle,
      description: categoryDescription,
      type: "None",
    };

    mutation.mutate(newCategory);
    setLoadingCreateCategory(true);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleModalClose = () => {
    setSelectedCategory(null);
    setIsOpenChooseNameModal(false);
    setIsCreatingCategory(false);
    setCategoryTitle("");
    setCategoryDescription("");
  };

  return (
    <Modal
      className="font-Quicksand"
      title={title}
      open={isOpenChooseNameModal}
      onCancel={handleModalClose}
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
              <label
                htmlFor="name"
                className="text-sm text-dark-100 dark:text-white font-bold"
              >
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="border-2 border-gray-200 dark:border-gray-600 p-2 rounded w-full outline-none text-dark-100  dark:bg-dark-100 dark:text-white"
                onChange={(e) => setFieldValue("name", e.target.value)}
                value={values.name}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-[0.80rem] font-medium"
              />
            </div>

            <Select
              className="customSelect w-full font-Quicksand font-medium placeholder:font-medium"
              options={processedOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Categories"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />

            {!isCreatingCategory && (
              <Button
                onClick={() => setIsCreatingCategory(true)}
                className="w-full font-Quicksand font-bold !bg-blue-200 !p-5 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
              >
                Create Category
              </Button>
            )}

            {isCreatingCategory && (
              <div className="w-full flex flex-col gap-2">
                <input
                  className="border-2 border-gray-200 dark:border-gray-600 outline-none p-3 rounded-md placeholder:font-medium text-dark-100  dark:bg-dark-100 dark:text-white"
                  placeholder="Title"
                  value={categoryTitle}
                  onChange={(e) => setCategoryTitle(e.target.value)}
                  required
                />
                <input
                  className="border-2 border-gray-200 dark:border-gray-600 outline-none p-3 rounded-md placeholder:font-medium text-dark-100  dark:bg-dark-100 dark:text-white"
                  placeholder="Description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
                <div className="w-full flex flex-row justify-center items-center gap-2">
                  <Button
                    onClick={() => setIsCreatingCategory(false)}
                    className="w-1/2 font-Quicksand font-bold !bg-red-200 !p-4 !shadow !text-red-500 !text-[0.90rem] !border-[2.5px] !border-red-500"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCategory}
                    loading={loadingCreateCategory}
                    className="w-1/2 font-Quicksand font-bold !bg-blue-200 !p-4 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
                  >
                    Create
                  </Button>
                </div>
              </div>
            )}

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
