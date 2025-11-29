import { useState } from "react";
import { Select, Spin } from "antd";
import { Field } from "formik";
import ButtonSectionHandler from "@module/container/main/create-form/modal-handlers/ButtonSectionHandler.js";
import "@styles/allRepeatStyles.css";

const ButtonSection = ({
  values,
  infoReqBtn,
  setInfoReqBtn,
  selectedDeviceId,
  setSelectedDeviceId,
  deviceStatus,
  optionsDevices,
  registersStatus,
  optionsRegisters,
  setFieldValue,
  forceShow = false,
  setBackground,
  setButtonBetData,
}) => {
  const { isLoadingRegisters, registersError } = registersStatus;
  const { isLoading, error } = deviceStatus;
  const [displayTypeButton, setDisplayTypeButton] = useState("externallink");
  const [optionsForm, setOptionsForm] = useState([]);

  const { dataForms } = ButtonSectionHandler({ setOptionsForm });

  const processedOptions = optionsForm.map((option) => ({
    ...option,
    value: option.value,
  }));

  return (
    <>
      {(forceShow || values.type === "button") && (
        <>
          <div>
            <label className="font-bold text-dark-100 dark:text-white">
              Type
            </label>
            <div className="w-full flex flex-row justify-between items-center gap-1 font-bold">
              {["externallink", "chooseform", "selectdevice"].map((type) => (
                <label
                  key={type}
                  className={`w-4/12 flex flex-row justify-center items-center gap-2 bg-blue-100 rounded-md p-2 cursor-pointer
                    ${
                      displayTypeButton === type
                        ? "border-2 border-blue-500 text-dark-100"
                        : "border border-transparent text-gray-100"
                    }`}
                  onClick={() => setDisplayTypeButton(type)}
                >
                  <Field
                    type="radio"
                    className="hidden"
                    checked={displayTypeButton === type}
                  />
                  {type.charAt(0).toUpperCase() +
                    type.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>
          </div>

          <Field
            type="text"
            name="titlebtn"
            placeholder="Button Title"
            className="py-[0.20rem] w-full inputStyle"
          />

          {displayTypeButton === "externallink" && (
            <Field
              type="text"
              name="path"
              placeholder="External link"
              className="px-3 py-[0.20rem] w-full inputStyle"
            />
          )}

          {optionsForm && dataForms && displayTypeButton === "chooseform" && (
            <>
              <Select
                className="customSelect w-full font-Quicksand"
                placeholder="Choose form"
                options={processedOptions}
                onChange={(value) => {
                  setFieldValue("idForm", value);
                }}
                showSearch={true}
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />

              {values.idForm && (
                <Select
                  className="customSelect w-full font-Quicksand"
                  placeholder="Select the type of display"
                  onChange={(value) => setFieldValue("typeDisplay", value)}
                >
                  <Select.Option value="form">Show in Form</Select.Option>
                  <Select.Option value="modal">Show in Modal</Select.Option>
                </Select>
              )}
            </>
          )}

          {displayTypeButton === "selectdevice" &&
            (isLoading ? (
              <div className="w-full h-auto flex flex-row justify-center items-center bg-blue-50 p-2 rounded-lg">
                <Spin />
              </div>
            ) : error ? (
              <p className="text-center text-red-500">Error: {error.message}</p>
            ) : (
              <Select
                className="customSelect w-full font-Quicksand"
                placeholder="Select Device"
                options={optionsDevices}
                showSearch={true}
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onChange={(value) => setSelectedDeviceId(value)}
              />
            ))}

          {selectedDeviceId &&
            displayTypeButton !== "externallink" &&
            displayTypeButton !== "chooseform" && (
              <div className="w-full">
                {isLoadingRegisters ? (
                  <div className="w-full h-auto flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                    <Spin />
                  </div>
                ) : registersError ? (
                  <p className="text-center text-red-500">
                    Error: {registersError.message}
                  </p>
                ) : (
                  <Select
                    className="customSelect w-full font-Quicksand"
                    options={optionsRegisters}
                    placeholder="Select register"
                    showSearch={true}
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    onChange={(value) =>
                      setInfoReqBtn({
                        ...infoReqBtn,
                        register_id: value,
                      })
                    }
                  />
                )}

                <div className="flex flex-col justify-center items-center gap-2 pt-2">
                  <input
                    className="px-3 py-[0.20rem] w-full inputStyle"
                    type="text"
                    value={infoReqBtn.title}
                    placeholder="Title req"
                    onChange={(e) =>
                      setInfoReqBtn({
                        ...infoReqBtn,
                        title: e.target.value,
                      })
                    }
                  />

                  <input
                    className="px-3 py-[0.20rem] w-full inputStyle"
                    placeholder="Value req"
                    type="text"
                    value={infoReqBtn.value}
                    onChange={(e) =>
                      setInfoReqBtn({
                        ...infoReqBtn,
                        value: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex flex-row justify-center items-center gap-1 p-2">
                  <div className="w-1/2 flex flex-row justify-start items-center gap-2">
                    <Field
                      type="checkbox"
                      name="singleIncrease"
                      id="singleIncrease"
                      checked={infoReqBtn.singleIncrease}
                      onChange={() =>
                        setInfoReqBtn({
                          ...infoReqBtn,
                          singleReduction: false,
                          singleIncrease: true,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="singleIncrease"
                      className="text-sm font-bold cursor-pointer"
                    >
                      Add single
                    </label>
                  </div>
                  <div className="w-1/2 flex flex-row justify-start items-center gap-2">
                    <Field
                      type="checkbox"
                      name="singleReduction"
                      id="singleReduction"
                      checked={infoReqBtn.singleReduction}
                      onChange={() =>
                        setInfoReqBtn({
                          ...infoReqBtn,
                          singleReduction: true,
                          singleIncrease: false,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor="singleReduction"
                      className="text-sm font-bold cursor-pointer"
                    >
                      Single removal
                    </label>
                  </div>
                </div>
              </div>
            )}

          {displayTypeButton === "selectdevice" && (
            <>
              <div className="h-auto flex flex-row justify-center items-end gap-1">
                <Select
                  className="customSelect w-full"
                  placeholder="Condition definition"
                  onChange={(value) => {
                    setBackground(true);
                    setButtonBetData({
                      bet: value,
                      betList: [],
                    });
                  }}
                >
                  <Select.Option value="bigger">
                    greater than &gt;
                  </Select.Option>
                  <Select.Option value="smaller">less than &lt;</Select.Option>
                  <Select.Option value="equal">equal =</Select.Option>
                  <Select.Option value="GreaterThanOrEqual">
                    greater than or equal &gt;=
                  </Select.Option>
                  <Select.Option value="LessThanOrEqual">
                    less than or equal &lt;=
                  </Select.Option>
                </Select>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ButtonSection;
