import { useState } from "react";
import { Modal, Spin } from "antd";
import FormDisplayHandler from "@module/container/main/create-form/FormDisplayHandler.js";

function FormDisplay({
  showModalFormDisplay,
  setShowModalFormDisplay,
  idForm,
}) {
  const [formInfo, setFormInfo] = useState("");

  const { isLoading, error } = FormDisplayHandler({ idForm, setFormInfo });

  return (
    <Modal
      className="font-Quicksand"
      open={showModalFormDisplay}
      onCancel={() => setShowModalFormDisplay(false)}
      footer={null}
      style={{ height: "100vh" }}
    >
      <div className="h-full w-full flex flex-col justify-center items-center p-8 bg-white">
        {isLoading ? (
          <Spin className="w-full h-full" />
        ) : error ? (
          <span className="text-red-500 text-base">error</span>
        ) : (
          <div className="w-full h-[20rem] flex flex-row justify-center items-center">
            <iframe
              className="w-full h-full overflow-hidden"
              srcDoc={formInfo}
              title="Content Preview"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

export default FormDisplay;
