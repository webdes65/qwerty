import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button, Modal, Select, Spin } from "antd";
import { Formik, Form } from "formik";
import CustomField from "@components/module/CustomField";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

const AddSubProjectModal = ({
  isModalOpenAddSub,
  setIsModalOpenAddSub,
  id,
}) => {
  const queryClient = useQueryClient();
  const [submitPending, setSubmitPending] = useState(false);
  const [optionsTypes, setOptionsTypes] = useState([]);
  const [arId, setArId] = useState("");
  const [arData, setArData] = useState("");
  const [options, setOptions] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedForms, setSelectedForms] = useState({});

  const { data: dataAR } = useQuery(["ARList"], () =>
    request({
      method: "GET",
      url: "/api/augmented-realities",
    }),
  );

  useEffect(() => {
    if (dataAR) {
      const selectOptions = dataAR.data.map((item) => ({
        label: item.name,
        value: item.uuid,
      }));
      setOptionsTypes(selectOptions);
    }
  }, [dataAR]);

  const {
    data: categoriesData,
    isLoading,
    isError: isErrorAR,
    error: errorAR,
  } = useQuery(
    ["ab", arId],
    () =>
      request({
        method: "GET",
        url: `/api/augmented-realities/${arId}`,
      }),
    {
      enabled: !!arId,
    },
  );

  useEffect(() => {
    if (categoriesData?.data?.data?.[1]) {
      const values = Object.values(categoriesData.data.data[1]);
      const ids = values.map((item) => item.id);
      setFiles(ids);
      setArData(categoriesData.data.data[1]);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (isErrorAR) {
      logger.error(errorAR?.message);
    }
  }, [isErrorAR, errorAR]);

  const { data } = useQuery(["GetForms"], () =>
    request({
      method: "GET",
      url: "/api/forms",
    }),
  );

  useEffect(() => {
    if (data) {
      const newOptions = data.data.map((item) => ({
        label: item.name.length > 10 ? item.name.slice(0, 10) : item.name,
        value: item.id,
      }));
      setOptions(newOptions);
    }
  }, [data]);

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

  const mutation = useMutation(
    (data) =>
      request({ method: "POST", url: `/api/projects/${id}/subs`, data }),
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        setIsModalOpenAddSub(false);
        queryClient.invalidateQueries("subsList");
      },
      onError: (error) => {
        logger.error(error);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    },
  );

  const handleSelectChange = (arItemId, value) => {
    setSelectedForms((prevState) => ({
      ...prevState,
      [arItemId]: value,
    }));
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
        onSubmit={async (values, { setFieldValue }) => {
          const formData = {
            ...values,
            files,
            forms: selectedForms,
          };
          setSubmitPending(true);
          await mutation.mutateAsync(formData);

          setFieldValue("name", "");
          setFieldValue("description", "");
          setArId("");
          setArData("");
        }}
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
