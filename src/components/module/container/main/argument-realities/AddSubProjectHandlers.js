import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function AddSubProjectHandlers({
  setOptionsTypes,
  setArData,
  setOptions,
  setIsModalOpenAddSub,
  id,
}) {
  const queryClient = useQueryClient();

  const [arId, setArId] = useState("");
  const [files, setFiles] = useState([]);
  const [submitPending, setSubmitPending] = useState(false);
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

  const handlerSubmit = async (values, { setFieldValue }) => {
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
  };

  const handleSelectChange = (arItemId, value) => {
    setSelectedForms((prevState) => ({
      ...prevState,
      [arItemId]: value,
    }));
  };

  return {
    arId,
    setArId,
    isLoading,
    submitPending,
    handlerSubmit,
    handleSelectChange,
  };
}
