import { Select, Spin } from "antd";

export default function DeviceOfInputCard({
  isLoading,
  error,
  optionsDevices,
  setSelectedDeviceId,
  selectedDeviceId,
  isLoadingRegisters,
  registersError,
  optionsRegisters,
  setInfoReqBtn,
  infoReqBtn,
}) {
  return (
    <>
      {isLoading ? (
        <div className="w-full h-auto flex flex-row justify-center items-center bg-blue-50 dark:bg-gray-100 p-2 rounded-lg">
          <Spin className="dark:text-lightBlue" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error.message}</p>
      ) : (
        <Select
          className="customSelect ant-select-selector font-medium w-full placeholder:!font-bold"
          options={optionsDevices}
          placeholder="Select device"
          onChange={(value) => setSelectedDeviceId(value)}
        />
      )}

      {selectedDeviceId && (
        <>
          {isLoadingRegisters ? (
            <div className="w-full h-auto flex flex-row justify-center items-center bg-blue-50 dark:bg-gray-100 p-2 rounded-lg">
              <Spin className="dark:text-lightBlue" />
            </div>
          ) : registersError ? (
            <p className="text-center text-red-500">
              Error: {registersError.message}
            </p>
          ) : (
            <Select
              className="customSelect ant-select-selector w-full"
              placeholder="Select registers"
              options={optionsRegisters}
              onChange={(value) =>
                setInfoReqBtn({
                  ...infoReqBtn,
                  register_id: value,
                })
              }
            />
          )}
        </>
      )}
    </>
  );
}
