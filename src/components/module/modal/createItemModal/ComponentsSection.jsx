import { useState } from "react";
import { Button, Spin } from "antd";
import ComponentsSectionHandlers from "@module/container/main/create-component/ComponentsSectionHandlers.js";
import "@styles/allRepeatStyles.css";

const ComponentsSection = ({
  values,
  setComponentsList,
  setIsOpenCreateModal,
}) => {
  const [deletingId, setDeletingId] = useState(null);

  const {
    dataComponents,
    isLoadingComponents,
    isErrorComponents,
    removeComponent,
  } = ComponentsSectionHandlers({ setDeletingId });

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
        isLoadingComponents ? (
          <div className="text-center text-gray-500 py-5">
            <Spin />
          </div>
        ) : isErrorComponents ? (
          <div className="text-start text-red-500 font-bold py-5">
            Error fetching components. Please try again later.
          </div>
        ) : dataComponents &&
          dataComponents.data &&
          dataComponents.data.length > 0 ? (
          <div className="flex flex-row justify-center items-center flex-wrap pb-5">
            {dataComponents?.data?.map((item) => {
              const modifiedContent = modifyBackground(
                modifyContent(item.content),
              );
              return (
                <div key={item.uuid} className="w-full p-1">
                  <div className="w-full h-auto rounded-lg p-2 shadow-lg bg-gray-200">
                    <h3 className="font-semibold text-[1rem] px-2 text-dark-100">
                      <span className="text-sm">Name : </span>
                      {item.name}
                    </h3>

                    <div className="w-full h-full flex flex-row justify-center items-center">
                      <iframe
                        className="w-1/2 h-full p-5 overflow-hidden"
                        srcDoc={modifiedContent}
                        title="Content Preview"
                      />
                    </div>

                    <div className="w-full h-auto flex flex-row justify-center items-center gap-2">
                      <Button
                        onClick={() => {
                          const updatedIndex = {
                            ...item,
                            position: { x: 0, y: 0 },
                          };
                          setComponentsList((componentsList) => [
                            ...componentsList,
                            updatedIndex,
                          ]);

                          setIsOpenCreateModal(false);
                        }}
                        className="w-1/2 font-medium buttonPrimaryStyle"
                        loading={deletingId === item.uuid}
                      >
                        Add
                      </Button>
                      <Button
                        onClick={() => removeComponent(item.uuid)}
                        className="w-1/2 font-medium buttonSecondaryStyle"
                        loading={deletingId === item.uuid}
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
