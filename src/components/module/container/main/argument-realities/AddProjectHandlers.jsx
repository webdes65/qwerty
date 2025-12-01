import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function AddProjectHandlers({
  setSubmitPending,
  setOptionsTyps,
  setOptionsCities,
  setOptionsDevices,
  setIsModalOpenAddProject,
}) {
  const queryClient = useQueryClient();

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

  const { data: dataCities } = useQuery(["fetchCities"], () =>
    request({
      method: "GET",
      url: "/api/cities",
    }),
  );

  useEffect(() => {
    if (dataCities) {
      const newOptions = dataCities.data.map((item) => ({
        label: item.name,
        value: item.uuid,
      }));
      setOptionsCities(newOptions);
    }
  }, [dataCities]);

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

  const handlerSubmit = async (values, { setFieldValue }) => {
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
  };

  return { handlerSubmit };
}
