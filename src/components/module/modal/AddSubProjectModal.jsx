import { useState } from "react";
import { Button, Modal, Select, Spin } from "antd";
import { Formik, Form } from "formik";
import CustomField from "@components/module/CustomField";
import AddSubProjectHandlers from "@module/container/main/argument-realities/AddSubProjectHandlers.js";

const AddSubProjectModal = ({
  isModalOpenAddSub,
  setIsModalOpenAddSub,
  id,
}) => {
  const [optionsTypes, setOptionsTypes] = useState([]);
  const [arData, setArData] = useState("");
  const [options, setOptions] = useState([]);

  const {
    arId,
    setArId,
    isLoading,
    submitPending,
    handlerSubmit,
    handleSelectChange,
  } = AddSubProjectHandlers({
    setOptionsTypes,
    setArData,
    setOptions,
    setIsModalOpenAddSub,
    id,
  });

  const initialValues = {
    name: "",
    description: "",
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
      title="Add SubProject"
      open={isModalOpenAddSub}
      onCancel={() => setIsModalOpenAddSub(false)}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handlerSubmit}
      >
        <Form className="w-full flex flex-col justify-center items-start gap-2 pt-6">
          <CustomField id={"name"} name={"name"} placeholder={"Name"} />
          <CustomField
            id={"description"}
            name={"description"}
            placeholder={"Description"}
          />
          <Select
            className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
            options={optionsTypes}
            placeholder="Select AR"
            value={arId || null}
            onChange={(value) => setArId(value)}
          />

          <div className="w-full flex flex-wrap gap-2">
            {isLoading ? (
              <div className="w-full flex justify-center items-center pt-5">
                <Spin size="large" />
              </div>
            ) : (
              arData &&
              Object.values(arData).map((item) => (
                <div
                  key={item.id}
                  className="w-[14rem] h-[300px] flex flex-col justify-start items-center gap-2 rounded-xl shadow-xl"
                >
                  <img
                    alt="Augmented Reality"
                    src={item.path}
                    className="w-full h-[200px] object-cover rounded-t-xl"
                  />

                  <p className="px-2 w-full items-start font-bold font-Quicksand">
                    Index : {item.use_type}
                  </p>
                  <div className="w-full px-2">
                    <Select
                      mode="multiple"
                      className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
                      options={options}
                      maxTagCount={1}
                      onChange={(value) => handleSelectChange(item.id, value)}
                      placeholder="Choose Form"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="w-full h-auto flex flex-row justify-center items-center pt-5">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitPending}
              className="w-1/2 h-auto flex flex-row justify-center items-center p-2 font-Quicksand"
            >
              Submit
            </Button>
          </div>
        </Form>
      </Formik>
    </Modal>
  );
};
export default AddSubProjectModal;
