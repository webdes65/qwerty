import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button, Modal, Select } from "antd";
import { Formik, Form, ErrorMessage } from "formik";
import CustomField from "@components/module/CustomField";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

const AddProject = ({ isModalOpenAddProject, setIsModalOpenAddProject }) => {
  const queryClient = useQueryClient();
  const [submitPending, setSubmitPending] = useState(false);
  const [optionsTyps, setOptionsTyps] = useState([]);
  const [optionsCitys, setOptionsCitys] = useState([]);
  const [optionsDevices, setOptionsDevices] = useState([]);

  const { data: dataTypes } = useQuery(["fetchType"], () =>
    request({
      method: "GET",
      url: "/api/projects/types",
    }),
  );

  useEffect(() => {
    if (dataTypes) {
      const formattedOptions = Object.keys(dataTypes.data).map((key) => {
        const group = dataTypes.data[key];
        const children = group?.children
          ? Object.keys(group.children).map((childKey) => ({
              label: group.children[childKey],
              value: key + "_" + childKey,
            }))
          : [];
        return {
          label: <strong>{group.title}</strong>,
          options: children,
        };
      });

      setOptionsTyps(formattedOptions);
    }
  }, [dataTypes]);

  const { data: dataCitys } = useQuery(["fetchCitys"], () =>
    request({
      method: "GET",
      url: "/api/cities",
    }),
  );

  useEffect(() => {
    if (dataCitys) {
      const newOptions = dataCitys.data.map((item) => ({
        label: item.name,
        value: item.uuid,
      }));
      setOptionsCitys(newOptions);
    }
  }, [dataCitys]);

  const { data: devicesData } = useQuery(["getDevices"], () =>
    request({
      method: "GET",
      url: "/api/devices",
    }),
  );

  useEffect(() => {
    if (devicesData) {
      const newOptions = devicesData.data.map((item) => ({
        label: item.name,
        value: item.uuid,
      }));
      setOptionsDevices(newOptions);
    }
  }, [devicesData]);

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

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/projects", data }),
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        setIsModalOpenAddProject(false);
        queryClient.invalidateQueries("getProject");
      },
      onError: (error) => {
        logger.error(error);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    },
  );

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
        onSubmit={async (values, { setFieldValue }) => {
          setSubmitPending(true);
          try {
            await mutation.mutateAsync(values);

            setIsModalOpenAddProject(false);

            setFieldValue("name", "");
            setFieldValue("address", "");
            setFieldValue("description", "");
            setFieldValue("type", "");
            setFieldValue("city", "");
            setFieldValue("devices", []);
            toast.success("Project added successfully!");
          } catch (error) {
            logger.error("Error adding project:", error);
            toast.error("Failed to add project!");
          } finally {
            setSubmitPending(false);
          }
        }}
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
              options={optionsCitys}
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

export default AddProject;
