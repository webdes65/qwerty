import { Button, Modal, Select, Spin } from "antd";
import { Formik, Form, Field } from "formik";
import { useEffect, useState } from "react";
import CustomField from "../CustomField";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { request } from "../../../services/apiService";
import { toast } from "react-toastify";

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
          new Array(maxColumns).fill({ device: null, register: [], count: 0 })
        )
    );
  };

  const [optionsDevices, setOptionsDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const {
    data: devicesData,
    // isLoading: isLoadingDevices,
    // error: devicesError,
  } = useQuery(["getDevices"], () =>
    request({ method: "GET", url: "/api/devices" })
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
    }
  );

  useEffect(() => {
    if (registersData) {
      const newOptions = registersData.data.map((item) => ({
        label: `${item.title} (${item.uuid})`,
        value: item.uuid,
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
        console.error(error);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    }
  );

  return (
    <Modal
      className="font-Quicksand"
      title="Add Graph"
      open={isOpenAddGraphModal}
      onCancel={() => setIsOpenAddGraphModal(false)}
      footer={null}
      width={600}
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
                      Math.max(0, parseInt(e.target.value || 0, 10))
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
                      Math.max(0, parseInt(e.target.value || 0, 10))
                    );
                    handleChange(e);
                    generateGrid(e.target.value, values.columns);
                  }}
                  className="p-2 border-2 border-gray-200 rounded-lg w-full outline-none"
                />
              </div>
              <div className="w-full mt-4 grid gap-2">
                {grid.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="w-full flex flex-row justify-around items-center gap-2"
                  >
                    {row.map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className="w-1/2 h-auto border-2 border-gray-200 rounded-md"
                      >
                        <div className="w-full h-full p-2 flex flex-col justify-between items-center gap-2">
                          <Select
                            className="customSelect w-full font-Quicksand font-bold"
                            options={optionsDevices}
                            value={
                              gridValues[rowIndex][colIndex]?.device || null
                            }
                            placeholder="Devices"
                            onChange={(value) => {
                              setSelectedDeviceId(value);
                              handleDeviceChange(rowIndex, colIndex, value);
                            }}
                          />
                          {isLoadingRegisters ? (
                            <Spin className="w-full h-full" />
                          ) : (
                            <Select
                              mode="multiple"
                              maxTagCount={1}
                              className="customSelect ant-select-selector w-full font-Quicksand font-bold"
                              options={optionsRegisters}
                              placeholder="Registers"
                              value={
                                gridValues[rowIndex][colIndex]?.register || []
                              }
                              onChange={(value) =>
                                handleRegisterChange(rowIndex, colIndex, value)
                              }
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
                                e.target.value
                              )
                            }
                            className="w-full border-2 border-gray-200 outline-none py-1 px-3 rounded-md font-medium placeholder:text-[#aeb7be]"
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
