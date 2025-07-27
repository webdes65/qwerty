import { Button, Spin } from "antd";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "../../../../services/apiService";

const ComponentsSection = ({
  values,
  setComponentsList,
  setIsOpenCreateModal,
}) => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  const {
    data: dataComponents,
    isLoading: isLoadingFetchComponents,
    error: imgsErrorFetchComponents,
  } = useQuery(["fetchComponents"], () =>
    request({
      method: "GET",
      url: "/api/components",
    })
  );

  const removeComponent = (id) => {
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  const deleteMutation = useMutation(
    (id) => request({ method: "DELETE", url: `/api/components/${id}` }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["fetchComponents"]);
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const modifyContent = (content) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    const dropBox = tempDiv.querySelector("#dropBox");

    if (dropBox) {
      dropBox.style.width = "100%";
      dropBox.style.backgroundColor = "white";
      dropBox.style.position = "relative";
      dropBox.style.borderRadius = "7px";
    }
    return tempDiv.innerHTML;
  };

  const modifyBackground = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    const dropBox = doc.querySelector("#dropBox");
    if (dropBox) {
      dropBox.style.backgroundColor = "transparent";
    }

    return doc.documentElement.outerHTML;
  };

  return (
    <>
      {values.type === "components" ? (
        isLoadingFetchComponents ? (
          <div className="text-center text-gray-500 py-5">
            <Spin />
          </div>
        ) : imgsErrorFetchComponents ? (
          <div className="text-start text-red-500 font-bold py-5">
            Error fetching components. Please try again later.
          </div>
        ) : dataComponents &&
          dataComponents.data &&
          dataComponents.data.length > 0 ? (
          <div className="flex flex-row justify-center items-center flex-wrap pb-5">
            {dataComponents?.data?.map((index) => {
              const modifiedContent = modifyBackground(
                modifyContent(index.content)
              );
              return (
                <div key={index.uuid} className="w-full p-1">
                  <div className="w-full h-auto rounded-lg p-2 shadow-lg bg-gray-200">
                    <h3 className="font-semibold text-[1rem] px-2">
                      <span className="text-gray-500 text-sm">Name : </span>
                      {index.name}
                    </h3>

                    <div className="w-full h-full flex flex-row justify-center items-center">
                      <iframe
                        className="w-1/2 h-full p-5 overflow-hidden "
                        srcDoc={modifiedContent}
                        title="Content Preview"
                        scrolling="no"
                      />
                    </div>

                    <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
                      <Button
                        onClick={() => {
                          const updatedIndex = {
                            ...index,
                            position: { x: 0, y: 0 },
                          };
                          setComponentsList((componentsList) => [
                            ...componentsList,
                            updatedIndex,
                          ]);

                          setIsOpenCreateModal(false);
                        }}
                        className="w-1/2 font-Quicksand font-medium !bg-blue-200 !p-5 !shadow !text-[#3b82f6] !text-[0.90rem] !border-[2.5px] !border-blue-500"
                        loading={deletingId === index.uuid}
                      >
                        Add
                      </Button>
                      <Button
                        onClick={() => removeComponent(index.uuid)}
                        className="w-1/2 font-Quicksand font-medium !bg-red-200 !p-5 !shadow !text-[#ef4444] !text-[0.90rem] !border-[2.5px] !border-red-500"
                        loading={deletingId === index.uuid}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-start text-gray-500 py-5 font-bold">
            No components available.
          </div>
        )
      ) : null}
    </>
  );
};

export default ComponentsSection;
