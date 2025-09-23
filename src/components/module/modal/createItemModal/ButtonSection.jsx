import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Select, Spin } from "antd";
import { Field } from "formik";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

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
}) => {
  const { isLoadingRegisters, registersError } = registersStatus;
  const { isLoading, error } = deviceStatus;
  const [dispalyTypeButton, setDispalyTypeButton] = useState("externallink");
  const [optionsForm, setOptionsForm] = useState([]);

  /*logger.log("infoReqBtn", infoReqBtn);
  logger.log("optionsRegisters", optionsRegisters);*/

  const { data: dataForms } = useQuery(["GetFormData"], () =>
    request({
      method: "GET",
      url: "/api/forms",
    }),
  );

  logger.log("dataForms", dataForms);

  const processedOptions = optionsForm.map((option) => ({
    ...option,
    value: option.value,
  }));

  useEffect(() => {
    if (dataForms) {
      const ids = dataForms.data.map((item) => ({
        label: item.name,
        value: item.uuid,
      }));
      setOptionsForm(ids);
    }
  }, [dataForms]);

  return (
    <>
      {(forceShow || values.type === "button") && (
        <>
          <div>
            <label className="font-bold text-gray-500">Type</label>
            <div className="w-full flex flex-row justify-between items-center gap-1 font-bold">
              {["externallink", "chooseform", "selectdevice"].map((type) => (
                <label
                  key={type}
                  className={`w-4/12 flex flex-row justify-center items-center gap-2 bg-blue-100 rounded-md p-2 cursor-pointer
        ${
          dispalyTypeButton === type
            ? "border-2 border-blue-500 text-blue-500"
            : "border border-transparent"
        }`}
                  onClick={() => setDispalyTypeButton(type)}
                >
                  <Field
                    type="radio"
                    className="hidden"
                    checked={dispalyTypeButton === type}
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
            className="border-2 border-gray-200 py-[0.20rem] px-3 rounded-md w-full outline-none"
          />

          {dispalyTypeButton === "externallink" && (
            <Field
              type="text"
              name="path"
              placeholder="External link"
              className="border-2 border-gray-200 p-2 py-[0.20rem] px-3 rounded-md w-full outline-none"
            />
          )}

          {optionsForm && dataForms && dispalyTypeButton === "chooseform" && (
            <>
              <Select
                className="customSelect w-full font-Quicksand"
                placeholder="Choose form"
                options={processedOptions}
                onChange={(value) => {
                  setFieldValue("idForm", value);
                }}
                allowClear
                showSearch
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

          {dispalyTypeButton === "selectdevice" &&
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
                onChange={(value) => setSelectedDeviceId(value)}
              />
            ))}

          {selectedDeviceId && (
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
                  className="border-2 border-gray-200 py-[0.20rem] px-3 rounded-md w-full outline-none"
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
                  className="border-2 border-gray-200 py-[0.20rem] px-3 rounded-md w-full outline-none"
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
        </>
      )}
    </>
  );
};

export default ButtonSection;
