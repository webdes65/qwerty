import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function AddGraphHandlers({
  setOptionsDevices,
  selectedDeviceId,
  setIsOpenAddGraphModal,
  gridValues,
  setGridValues,
}) {
  const queryClient = useQueryClient();

  const [optionsRegisters, setOptionsRegisters] = useState([]);
  const [submitPending, setSubmitPending] = useState(false);
  const [grid, setGrid] = useState([]);

  const { data: devicesData } = useQuery(["getDevices"], () =>
    request({ method: "GET", url: "/api/devices" }),
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

  const { data: registersData, isLoading: isLoadingRegisters } = useQuery(
    ["getRegisters", selectedDeviceId],
    () =>
      request({
        method: "GET",
        url: `/api/registers?device_id=${selectedDeviceId}`,
      }),
    {
      enabled: !!selectedDeviceId,
    },
  );

  useEffect(() => {
    if (registersData) {
      const newOptions = registersData.data.map((item) => ({
        label: item.title,
        value: item.uuid,
        title: `${item.title} (${item.uuid})`,
      }));
      setOptionsRegisters(newOptions);
    }
  }, [registersData]);

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/templates", data }),
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        setIsOpenAddGraphModal(false);
        queryClient.invalidateQueries("fetchGraphs");
      },
      onError: (error) => {
        logger.error(error);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    },
  );

  const generateGrid = (rows, columns) => {
    const maxRows = Math.min(parseInt(rows || 0, 10), 3);
    const maxColumns = Math.min(parseInt(columns || 0, 10), 3);
    const newGrid = Array(maxRows)
      .fill(null)
      .map(() => Array(maxColumns).fill(null));
    Array(maxRows)
      .fill(null)
      .map(() => Array(maxColumns).fill(false));
    setGrid(newGrid);
    setGridValues(
      new Array(maxRows)
        .fill(null)
        .map(() =>
          new Array(maxColumns).fill({ device: null, register: [], count: 0 }),
        ),
    );
  };

  const handleDeviceChange = (rowIndex, colIndex, value) => {
    setGridValues((prevValues) => {
      const updatedGrid = [...prevValues];
      if (!updatedGrid[rowIndex]) updatedGrid[rowIndex] = [];
      updatedGrid[rowIndex][colIndex] = {
        ...updatedGrid[rowIndex][colIndex],
        device: value,
      };
      return updatedGrid;
    });
  };

  const handleRegisterChange = (rowIndex, colIndex, value) => {
    setGridValues((prevValues) => {
      const updatedGrid = [...prevValues];
      if (!updatedGrid[rowIndex]) updatedGrid[rowIndex] = [];
      updatedGrid[rowIndex][colIndex] = {
        ...updatedGrid[rowIndex][colIndex],
        register: value,
      };
      return updatedGrid;
    });
  };

  const handleCountChange = (rowIndex, colIndex, value) => {
    setGridValues((prevValues) => {
      const updatedGrid = [...prevValues];
      if (!updatedGrid[rowIndex]) updatedGrid[rowIndex] = [];
      updatedGrid[rowIndex][colIndex] = {
        ...updatedGrid[rowIndex][colIndex],
        count: value,
      };
      return updatedGrid;
    });
  };

  const onSubmit = async (values) => {
    const flatGridValues = gridValues.flat().map((item) => ({
      device: item.device,
      registers: item.register,
      count: item.count,
    }));

    const updatedValues = {
      ...values,
      charts: flatGridValues,
    };

    setSubmitPending(true);
    mutation.mutate(updatedValues);
  };

  return {
    optionsRegisters,
    submitPending,
    grid,
    isLoadingRegisters,
    generateGrid,
    handleDeviceChange,
    handleRegisterChange,
    handleCountChange,
    onSubmit,
  };
}
