import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function AddDeviceHandlers({ setIsModalOpen }) {
  const queryClient = useQueryClient();

  const [submitPending, setSubmitPending] = useState(false);
  const [patterns, setPatterns] = useState([]);

  const { data } = useQuery(["GetConnections"], () =>
    request({ method: "GET", url: "/api/GetConnections" }),
  );

  const connectionOptions = data?.data?.map((item) => ({
    value: item.uuid,
    label: item.name,
  }));

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/devices", data }),
    {
      onSuccess: (data) => {
        toast.success(data.message);

        setPatterns([]);
        setIsModalOpen(false);
        queryClient.invalidateQueries("fetchDevices");
      },
      onError: (error) => {
        logger.error(error);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    },
  );

  const onSubmit = async (values) => {
    const {
      connectorArray,
      connectorCustom,
      separator,
      setter,
      ...restValues
    } = values;

    const updatedPatterns = patterns.map((pattern) => {
      const updatedPattern = { ...pattern };

      if (pattern.type === "array") {
        updatedPattern.connector = connectorArray;
      }

      if (pattern.type === "custom") {
        updatedPattern.separator = separator;
        updatedPattern.setter = setter;
        updatedPattern.connector = connectorCustom;
      }

      return updatedPattern;
    });

    const data = {
      ...restValues,
      patterns: updatedPatterns,
    };

    setSubmitPending(true);
    mutation.mutate(data);
  };

  const addPattern = () => {
    setPatterns([...patterns, { id: patterns.length + 1, type: null }]);
  };

  const updatePatternType = (id, value) => {
    setPatterns(
      patterns.map((pattern) =>
        pattern.id === id ? { ...pattern, type: value } : pattern,
      ),
    );
  };

  const removePattern = (id) => {
    setPatterns(patterns.filter((pattern) => pattern.id !== id));
  };

  return {
    submitPending,
    patterns,
    connectionOptions,
    onSubmit,
    addPattern,
    updatePatternType,
    removePattern,
  };
}
