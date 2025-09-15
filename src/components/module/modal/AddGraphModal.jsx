import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Button, Modal, Select, Spin } from "antd";
import { Formik, Form, Field } from "formik";
import CustomField from "@module/CustomField";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

const AddGraphModal = ({ isOpenAddGraphModal, setIsOpenAddGraphModal }) => {
  const [submitPending, setSubmitPending] = useState(false);

  const initialValues = {
    title: "",
    description: "",
    columns: "",
    rows: "",
  };

  const [grid, setGrid] = useState([]);
  const [gridValues, setGridValues] = useState([]);

  const generateGrid = (rows, columns) => {
    const maxRows = Math.min(parseInt(rows || 0, 10), 3);
    const maxColumns = Math.min(parseInt(columns || 0, 10), 3);
    const newGrid = Array(maxRows)
      .fill(null)
      .map(() => Array(maxColumns).fill(null));
    const newShowFields = Array(maxRows)
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

  const [optionsDevices, setOptionsDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const {
    data: devicesData,
    // isLoading: isLoadingDevices,
    // error: devicesError,
  } = useQuery(["getDevices"], () =>
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

  const [optionsRegisters, setOptionsRegisters] = useState([]);

  const {
    data: registersData,
    isLoading: isLoadingRegisters,
    // error: registersError,
  } = useQuery(
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

  const queryClient = useQueryClient();

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

  return (
    <Modal
      className="font-Quicksand"
      title="Add Graph"
      open={isOpenAddGraphModal}
      onCancel={() => setIsOpenAddGraphModal(false)}
      footer={null}
      width={900}
      style={{ top: 20 }}
      styles={{
        body: {
          maxHeight: "75vh",
          overflowY: "auto",
          padding: "20px",
        },
      }}
    >
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, handleChange }) => (
          <>
            <Form className="w-full flex flex-col justify-center items-start gap-2 pt-6">
              <CustomField id="title" name="title" placeholder="Title" />
              <CustomField
                id="description"
                name="description"
                placeholder="Description"
              />

              <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
                <Field
                  id="columns"
                  name="columns"
                  placeholder="Columns"
                  onChange={(e) => {
                    e.target.value = Math.min(
                      3,
                      Math.max(0, parseInt(e.target.value || 0, 10)),
                    );
                    handleChange(e);
                    generateGrid(values.rows, e.target.value);
                  }}
                  className="p-2 border-2 border-gray-200 rounded-lg w-full outline-none"
                />
                <Field
                  id="rows"
                  name="rows"
                  placeholder="Rows"
                  onChange={(e) => {
                    e.target.value = Math.min(
                      3,
                      Math.max(0, parseInt(e.target.value || 0, 10)),
                    );
                    handleChange(e);
                    generateGrid(e.target.value, values.columns);
                  }}
                  className="p-2 border-2 border-gray-200 rounded-lg w-full outline-none"
                />
              </div>
              <div className="w-full mt-4 space-y-3">
                {grid.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="w-full grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${row.length}, 1fr)`,
                      minHeight: "fit-content",
                    }}
                  >
                    {row.map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className="min-w-0 border-2 border-gray-200 rounded-md bg-gray-50"
                      >
                        <div className="p-3 space-y-3">
                          <Select
                            className="w-full"
                            options={optionsDevices}
                            value={
                              gridValues[rowIndex][colIndex]?.device || null
                            }
                            placeholder="Select Device"
                            onChange={(value) => {
                              setSelectedDeviceId(value);
                              handleDeviceChange(rowIndex, colIndex, value);
                            }}
                            showSearch
                            optionFilterProp="label"
                          />

                          {isLoadingRegisters ? (
                            <Spin className="w-full h-10 flex items-center justify-center" />
                          ) : (
                            <Select
                              maxTagCount={2}
                              maxTagTextLength={15}
                              className="w-full"
                              options={optionsRegisters}
                              placeholder="Select Registers"
                              value={
                                gridValues[rowIndex][colIndex]?.register || []
                              }
                              onChange={(value) =>
                                handleRegisterChange(rowIndex, colIndex, value)
                              }
                              showSearch
                              optionFilterProp="label"
                              style={{ minHeight: "32px" }}
                              styles={{
                                popup: {
                                  root: {
                                    maxWidth: 350,
                                  },
                                },
                              }}
                              tagRender={(props) => {
                                const { label, closable, onClose } = props;
                                const truncatedLabel =
                                  label.length > 15
                                    ? `${label.substring(0, 15)}...`
                                    : label;

                                return (
                                  <span
                                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md mr-1 mb-1 max-w-24"
                                    title={label}
                                  >
                                    <span className="truncate">
                                      {truncatedLabel}
                                    </span>
                                    {closable && (
                                      <button
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                        onClick={onClose}
                                      >
                                        ×
                                      </button>
                                    )}
                                  </span>
                                );
                              }}
                            />
                          )}

                          <input
                            type="number"
                            placeholder="Count"
                            value={gridValues[rowIndex][colIndex]?.count || ""}
                            onChange={(e) =>
                              handleCountChange(
                                rowIndex,
                                colIndex,
                                e.target.value,
                              )
                            }
                            className="w-full border-2 border-gray-200 outline-none py-2 px-3 rounded-md font-medium placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                            min="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="w-full h-auto flex flex-row justify-center items-center pt-5">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitPending}
                  className="w-1/2 font-Quicksand !bg-blue-200 !p-5 !shadow !text-blue-500 font-bold !text-[0.90rem] !border-[2.5px] !border-blue-500"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default AddGraphModal;
