import { useState } from "react";
import { Modal, Form, Button, Select } from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import CopyFormHandlers from "@module/container/main/create-form/modal-handlers/CopyFormHandlers.js";
import "@styles/dragOptionStyles.css";

const CopyFormModal = ({
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
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
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

  const processedOptions = (optionsCategories ?? []).map((option) => ({
    ...option,
    value: option.value,
  }));

  const {
    loadingCreateCategory,
    copyFormMutation,
    handleSubmit,
    handleCreateCategory,
  } = CopyFormHandlers({
    setIsOpenChooseNameModal,
    onSuccess,
    formId,
    selectedCategory,
    setCategoryTitle,
    setCategoryDescription,
    setIsCreatingCategory,
    categoryTitle,
    categoryDescription,
  });

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
              <label htmlFor="name" className="text-sm dragLabelStyle">
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="w-full uploadInputStyle"
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
                className="w-full dragButtonPrimaryStyle"
              >
                Create Category
              </Button>
            )}

            {isCreatingCategory && (
              <div className="w-full flex flex-col gap-2">
                <input
                  className="placeholder:font-medium uploadInputStyle"
                  placeholder="Title"
                  value={categoryTitle}
                  onChange={(e) => setCategoryTitle(e.target.value)}
                  required
                />
                <input
                  className="placeholder:font-medium uploadInputStyle"
                  placeholder="Description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
                <div className="w-full flex flex-row justify-center items-center gap-2">
                  <Button
                    onClick={() => setIsCreatingCategory(false)}
                    className="w-1/2 dragButtonSecondaryStyle"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateCategory}
                    loading={loadingCreateCategory}
                    className="w-1/2 dragButtonPrimaryStyle"
                  >
                    Create
                  </Button>
                </div>
              </div>
            )}

            <Button
              htmlType="submit"
              loading={copyFormMutation.isLoading}
              className="w-full dragButtonPrimaryStyle"
            >
              Copy Form
            </Button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CopyFormModal;
