import { useState } from "react";
import { Button, Modal, Select } from "antd";
import { Formik, Form, ErrorMessage } from "formik";
import CustomField from "@components/module/CustomField";
import AddProjectHandlers from "@module/container/main/argument-realities/AddProjectHandlers.jsx";

const AddProjectModal = ({
  isModalOpenAddProject,
  setIsModalOpenAddProject,
}) => {
  const [submitPending, setSubmitPending] = useState(false);
  const [optionsTyps, setOptionsTyps] = useState([]);
  const [optionsCities, setOptionsCities] = useState([]);
  const [optionsDevices, setOptionsDevices] = useState([]);

  const { handlerSubmit } = AddProjectHandlers({
    setSubmitPending,
    setOptionsTyps,
    setOptionsCities,
    setOptionsDevices,
    setIsModalOpenAddProject,
  });

  const initialValues = {
    name: "",
    address: "",
    description: "",
    type: "",
    city: "",
    devices: [],
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name is required";
    }
    if (!values.city) {
      errors.city = "City is required";
    }

    return errors;
  };

  return (
    <Modal
      className="font-Quicksand"
      title="Add Project"
      open={isModalOpenAddProject}
      onCancel={() => setIsModalOpenAddProject(false)}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handlerSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="w-full flex flex-col justify-center items-start gap-2 pt-6">
            <CustomField id={"name"} name={"name"} placeholder={"Name"} />
            <Select
              className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
              options={optionsTyps}
              placeholder="Type"
              onChange={(value) => setFieldValue("type", value)}
            />
            <Select
              className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
              options={optionsCities}
              placeholder="Citys"
              onChange={(value) => setFieldValue("city", value)}
            />
            <ErrorMessage
              name="city"
              component="div"
              className="text-red-500 text-sm"
            />
            <Select
              mode="multiple"
              className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
              options={optionsDevices}
              placeholder="Devices"
              onChange={(value) => setFieldValue("devices", value)}
            />
            <CustomField
              id={"address"}
              name={"address"}
              placeholder={"Address"}
            />
            <CustomField
              id={"description"}
              name={"description"}
              placeholder={"Description"}
            />
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
        )}
      </Formik>
    </Modal>
  );
};

export default AddProjectModal;
