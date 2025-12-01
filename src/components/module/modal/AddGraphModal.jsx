import { useState } from "react";
import { Button, Modal, Select, Spin } from "antd";
import { Formik, Form, Field } from "formik";
import CustomField from "@module/CustomField";
import AddGraphHandlers from "@module/container/main/graphs/AddGraphHandlers.js";
import "@styles/allRepeatStyles.css";

const AddGraphModal = ({ isOpenAddGraphModal, setIsOpenAddGraphModal }) => {
  const [optionsDevices, setOptionsDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [gridValues, setGridValues] = useState([]);

  const initialValues = {
    title: "",
    description: "",
    columns: "",
    rows: "",
  };

  const {
    optionsRegisters,
    submitPending,
    grid,
    isLoadingRegisters,
    generateGrid,
    handleDeviceChange,
    handleRegisterChange,
    handleCountChange,
    onSubmit,
  } = AddGraphHandlers({
    setOptionsDevices,
    selectedDeviceId,
    setIsOpenAddGraphModal,
    gridValues,
    setGridValues,
  });

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
                  className="!p-2 bg-white w-full inputStyle"
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
                  className="!p-2 bg-white w-full inputStyle"
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
                        className="min-w-0 border-2 border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-dark-100"
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
                              mode="multiple"
                              allowClear
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
                            className="w-full bg-white border-2 py-2 px-3 font-medium inputStyle placeholder:text-gray-400 dark:placeholder:text-white"
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
                  className="w-1/2 dark:!bg-blue-300 dark:!text-blue-600 dark:!border-blue-600 buttonPrimaryStyle"
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
