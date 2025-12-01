import { Button, Modal, Select } from "antd";
import { Formik, Form } from "formik";
import CustomField from "@components/module/CustomField";
import AddCityHandlers from "@module/container/main/city/AddCityHandlers.js";

const AddCityModal = ({ isModalOpen, setIsModalOpen }) => {
  const { submitPending, countryOptions, onSubmit } = AddCityHandlers({
    setIsModalOpen,
  });

  const initialValues = {
    name: "",
    country: "",
  };

  return (
    <Modal
      className="font-Quicksand"
      title="Add City"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <Formik initialValues={initialValues} validate={""} onSubmit={onSubmit}>
        {({ setFieldValue }) => (
          <Form className="w-full flex flex-col justify-center items-start gap-2 pt-6">
            <CustomField id={"name"} name={"name"} placeholder={"Name"} />

            <Select
              showSearch
              placeholder="Country"
              className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
              options={countryOptions}
              onChange={(value) => setFieldValue("country", value)}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
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
export default AddCityModal;
