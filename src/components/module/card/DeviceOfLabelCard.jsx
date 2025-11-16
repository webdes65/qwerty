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
    <div className="flex flex-col gap-4 py-4">
      {selectDevice ? (
        isLoadingDevices ? (
          <div className="w-full h-auto flex flex-row justify-center items-center bg-blue-50 dark:bg-gray-100 p-2 rounded-lg">
            <Spin className="dark:text-lightBlue" />
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
            <div className="w-full h-auto flex flex-row justify-center items-center bg-blue-50 dark:bg-gray-100 p-3 rounded-lg">
              <Spin className="dark:text-lightBlue" />
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
    </div>
  );
}
