import { Select } from "antd";
import { Field } from "formik";
import DeviceOfInputCard from "@module/card/DeviceOfInputCard.jsx";
import "@styles/formAndComponentStyles.css";

const TextInputSection = ({
  values,
  optionsDevices,
  deviceStatus,
  selectedDeviceId,
  setSelectedDeviceId,
  registersStatus,
  infoReqBtn,
  setInfoReqBtn,
  setFieldValue,
  optionsRegisters,
}) => {
  const { isLoading, error } = deviceStatus;
  const { isLoadingRegisters, registersError } = registersStatus;

  return (
    <>
      {values.type === "text input" && (
        <>
          <DeviceOfInputCard
            selectedDeviceId={selectedDeviceId}
            setSelectedDeviceId={setSelectedDeviceId}
            optionsDevices={optionsDevices}
            isLoadingRegisters={isLoadingRegisters}
            registersError={registersError}
            isLoading={isLoading}
            optionsRegisters={optionsRegisters}
            setInfoReqBtn={setInfoReqBtn}
            infoReqBtn={infoReqBtn}
            error={error}
          />

          <div className="w-full h-auto flex flex-row justify-center items-center gap-1">
            <div className="w-1/2">
              <Select
                className="customSelect ant-select-selector w-full"
                placeholder="Type title"
                options={[
                  { label: "String", value: "string" },
                  { label: "Number", value: "number" },
                ]}
                onChange={(value) => {
                  setFieldValue("typeTitleTextInput", value);
                }}
              />
            </div>
            <div className="w-1/2">
              {values.typeTitleTextInput === "number" ? (
                <Field
                  type="number"
                  name="title"
                  placeholder="Title"
                  className="py-[0.20rem] px-3 w-full bg-white inputStyle"
                />
              ) : (
                <Field
                  type="text"
                  name="title"
                  placeholder="Title"
                  className="py-[0.20rem] px-3 w-full bg-white inputStyle"
                />
              )}
            </div>
          </div>

          {selectedDeviceId && (
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="w-full">
                <input
                  className="py-[0.20rem] px-3 w-full bg-white inputStyle"
                  type="text"
                  placeholder="Title req"
                  value={infoReqBtn.title}
                  onChange={(e) =>
                    setInfoReqBtn({
                      ...infoReqBtn,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-full flex flex-row justify-center items-center gap-1">
                <div className="w-1/2">
                  <input
                    className="py-[0.20rem] px-3 w-full bg-white inputStyle"
                    type="text"
                    value={infoReqBtn.startRange}
                    placeholder="Start range"
                    onChange={(e) =>
                      setInfoReqBtn({
                        ...infoReqBtn,
                        startRange: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="w-1/2">
                  <input
                    className="py-[0.20rem] px-3 w-full bg-white inputStyle"
                    type="text"
                    placeholder="End range"
                    value={infoReqBtn.endRange}
                    onChange={(e) =>
                      setInfoReqBtn({
                        ...infoReqBtn,
                        endRange: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TextInputSection;
