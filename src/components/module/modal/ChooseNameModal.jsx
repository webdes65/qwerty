import { useState } from "react";
import { Modal, Form, Button, Select } from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

const ChooseNameModal = ({
  isOpenChooseNameModal,
  setIsOpenChooseNameModal,
  optionsCategories,
  setName,
  title,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const initialValues = {
    name: "",
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) errors.name = "Name is required";

    return errors;
  };

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
    if (!categoryTitle) {
      toast.error("Title is required!");
      return;
    }

    const newCategory = {
      title: categoryTitle,
      type: "None",
      description: categoryDescription,
    };

    mutation.mutate(newCategory);
    setLoadingCreateCategory(true);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleSubmit = (values, { resetForm }) => {
    if (!values.name.trim()) {
      toast.error("Form name is required");
      return;
    }

    if (!selectedCategory) {
      toast.error("Category is required");
      return;
    }

    setName(values.name);
    resetForm();
    setIsOpenChooseNameModal(false);
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
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <Form onFinish={handleSubmit} className="w-full flex flex-col gap-4">
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
                className="border-2 border-gray-200 dark:border-gray-600 p-2 rounded w-full outline-none bg-white text-dark-100  dark:bg-dark-100 dark:text-white"
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
                  className="border-2 border-gray-200 dark:border-gray-600 outline-none p-3 rounded-md placeholder:font-medium bg-white text-dark-100  dark:bg-dark-100 dark:text-white"
                  placeholder="Title"
                  value={categoryTitle}
                  onChange={(e) => setCategoryTitle(e.target.value)}
                  required
                />
                <input
                  className="border-2 border-gray-200 dark:border-gray-600 outline-none p-3 rounded-md placeholder:font-medium bg-white text-dark-100  dark:bg-dark-100 dark:text-white mb-2"
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
                    htmlType="button"
                    className="w-1/2 font-Quicksand font-bold !bg-blue-200 !p-4 !shadow !text-blue-500 !text-[0.90rem] !border-[2.5px] !border-blue-500"
                  >
                    Create
                  </Button>
                </div>
              </div>
            )}

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
