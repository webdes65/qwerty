import { Select, Spin } from "antd";

export default function DeviceOfLabelCard({
  selectDevice,
  setSelectDevice,
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
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="selectDevice"
          checked={selectDevice}
          onChange={(e) => setSelectDevice(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="selectDevice" className="text-sm">
          Enable Device Selection
        </label>
      </div>

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
            showSearch={true}
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
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
                showSearch={true}
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onChange={(value) => setFieldValue("temp", value)}
              />
            )
          )}
        </>
      )}
    </div>
  );
}
