import { useEffect, useState } from "react";
import { Modal, Form, Button, Select, Checkbox } from "antd";
import { Formik, Field, ErrorMessage } from "formik";
import UpdateFormHandlers from "@module/container/main/create-form/modal-handlers/UpdateFormHandlers.js";
import "@styles/dragOption.css";

export default function UpdateFormModal({
  name,
  updatedName,
  openUpdateModal,
  setOpenUpdateModal,
  onConfirm,
  handleDownloadHTML,
  optionsCategories,
  selectedCategory,
  setSelectedCategory,
  setUpdatedName,
  category,
}) {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isDefaultForm, setIsDefaultForm] = useState(false);

  const processedOptions = (optionsCategories ?? []).map((option) => ({
    ...option,
    value: option.value,
  }));

  useEffect(() => {
    if (category) {
      setSelectedCategory(category.uuid);
    }
  }, []);

  const initialValues = {
    updatedName: updatedName || "",
  };

  const validate = (values) => {
    const errors = {};
    if (!values.updatedName) {
      errors.updatedName = "Form name is required";
    }
    return errors;
  };

  const { handleCreateCategory, handleSubmit } = UpdateFormHandlers({
    setCategoryTitle,
    setCategoryDescription,
    setIsCreatingCategory,
    setLoadingCreateCategory,
    categoryTitle,
    optionsCategories,
    categoryDescription,
    selectedCategory,
    isDefaultForm,
    onConfirm,
    setUpdatedName,
    setIsDefaultForm,
    setOpenUpdateModal,
  });

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleModalClose = () => {
    setSelectedCategory(null);
    setIsCreatingCategory(false);
    setCategoryTitle("");
    setCategoryDescription("");
    setOpenUpdateModal(false);
  };

  return (
    <Modal
      className="font-Quicksand"
      title={`Are you sure you want to change the name from ${name}?`}
      open={openUpdateModal}
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
            <div className="flex flex-col gap-1">
              <label className="text-sm dragLabelStyle">New Name</label>
              <Field
                type="text"
                name="updatedName"
                className="w-full rounded-lg p-2 bg-white uploadInputStyle"
                onChange={(e) => setFieldValue("updatedName", e.target.value)}
                value={values.updatedName}
              />
              <ErrorMessage
                name="updatedName"
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
                  className="placeholder:font-medium bg-white uploadInputStyle"
                  placeholder="Title"
                  value={categoryTitle}
                  onChange={(e) => setCategoryTitle(e.target.value)}
                  required
                />
                <input
                  className="placeholder:font-medium bg-white uploadInputStyle"
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

            <Checkbox
              className="w-[100px]"
              checked={isDefaultForm}
              onChange={(e) => setIsDefaultForm(e.target.checked)}
            >
              Set default
            </Checkbox>

            <div className="flex flex-row justify-end items-center gap-2 mt-2">
              <Button
                key="cancel"
                onClick={() => setOpenUpdateModal(false)}
                className="dragButtonSecondaryStyle"
              >
                Cancel
              </Button>

              <Button
                key="download"
                onClick={handleDownloadHTML}
                className="font-Quicksand font-bold !bg-green-200 !p-5 !shadow text-green-500 !border-[2.5px] !border-green-500"
              >
                Download
              </Button>

              <Button
                key="confirm"
                htmlType="submit"
                type="primary"
                className="dragButtonPrimaryStyle"
              >
                Confirm
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
