import { Button, Modal, Select } from "antd";
import { Formik, Form } from "formik";
import CustomField from "../../../components/module/CustomField";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { request } from "../../../services/apiService";
import { toast } from "react-toastify";

const AddCityModal = ({ isModalOpen, setIsModalOpen }) => {
  const [submitPending, setSubmitPending] = useState(false);

  const { data } = useQuery(["fetchCountries"], () =>
    request({ method: "GET", url: "/api/GetCountries" })
  );

  const countryOptions =
    data?.data?.map((country) => ({
      value: country.uuid,
      label: country.en_name,
    })) || [];

  const onSubmit = async (values) => {
    setSubmitPending(true);
    mutation.mutate(values);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/cities", data }),
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        setIsModalOpen(false);
        queryClient.invalidateQueries("fetchCities");
      },
      onError: (error) => {
        console.error(error);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    }
  );

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
