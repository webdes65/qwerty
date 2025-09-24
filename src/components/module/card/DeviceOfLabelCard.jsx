import { Select, Spin } from "antd";

export default function DeviceOfLabelCard({
  selectDevice,
  isLoadingDevices,
  devicesError,
  optionsDevices,
  setSelectedDeviceId,
  selectedDeviceId,
  isLoadingRegisters,
  registersError,
  registersData,
  optionsRegisters,
  setFieldValue,
}) {
  return (
    <>
      {selectDevice ? (
        isLoadingDevices ? (
          <div className="w-full h-auto flex flex-row justify-center items-center bg-blue-50 p-2 rounded-lg">
            <Spin />
          </div>
        ) : devicesError ? (
          <p className="text-center text-red-500">
            Error: {devicesError.message}
          </p>
        ) : (
          <Select
            className="customSelect ant-select-selector w-full"
            placeholder="Select device"
            options={optionsDevices}
            onChange={(value) => {
              setSelectedDeviceId(value);
            }}
          />
        )
      ) : null}

      {selectDevice && selectedDeviceId && (
        <>
          {isLoadingRegisters ? (
            <div className="w-full h-auto flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
              <Spin />
            </div>
          ) : registersError ? (
            <p className="text-center text-red-500">
              Error: {registersError.message}
            </p>
          ) : (
            registersData && (
              <Select
                className="customSelect ant-select-selector w-full"
                placeholder="Select register"
                options={optionsRegisters}
                onChange={(value) => setFieldValue("temp", value)}
              />
            )
          )}
        </>
      )}
    </>
  );
}
