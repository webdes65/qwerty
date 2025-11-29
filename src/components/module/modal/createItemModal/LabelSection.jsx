import { Field } from "formik";
import DeviceOfLabelCard from "@module/card/DeviceOfLabelCard.jsx";
import BackgroundCustomization from "@module/card/form/modal-card/BackgroundCustomization.jsx";
import DataTypeSettings from "@module/card/form/modal-card/DataTypeSettings.jsx";

const LabelSection = ({ values, setFieldValue, props }) => {
  return (
    <>
      {values.type === "label" && (
        <>
          <Field
            type="text"
            name="title"
            placeholder="Title"
            className="border-2 border-gray-200 dark:border-gray-600 py-[0.20rem] px-3 rounded-md w-full outline-none text-dark-100 bg-white dark:bg-dark-100 dark:text-white"
          />

          <DeviceOfLabelCard
            selectDevice={props.selectDevice}
            setSelectDevice={props.setSelectDevice}
            isLoadingDevices={props.isLoadingDevices}
            devicesError={props.devicesError}
            optionsDevices={props.optionsDevices}
            setSelectedDeviceId={props.setSelectedDeviceId}
            selectedDeviceId={props.selectedDeviceId}
            isLoadingRegisters={props.isLoadingRegisters}
            registersError={props.registersError}
            registersData={props.registersData}
            optionsRegisters={props.optionsRegisters}
            setFieldValue={setFieldValue}
          />

          <DataTypeSettings
            values={values}
            setFieldValue={setFieldValue}
            props={props}
          />

          <BackgroundCustomization
            values={values}
            setFieldValue={setFieldValue}
            props={props}
          />
        </>
      )}
    </>
  );
};

export default LabelSection;
