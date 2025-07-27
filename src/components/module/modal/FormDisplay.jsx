import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { request } from "../../../services/apiService";

function FormDisplay({
  showModalFormDisplay,
  setShowModalFormDisplay,
  idForm,
}) {
  const [formInfo, setFormInfo] = useState("");
  const { data, isLoading, error } = useQuery(
    ["GetForms"],
    () =>
      request({
        method: "GET",
        url: "/api/forms",
      }),
    { enabled: !!idForm }
  );

  useEffect(() => {
    if (data?.data && idForm) {
      const formInfo = data.data.find((form) => form.id === idForm);
      if (formInfo) {
        setFormInfo(formInfo.content);
      } else {
        console.log("A form was not found with this ID.");
      }
    }
  }, [data, idForm]);

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
              scrolling="no"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

export default FormDisplay;
