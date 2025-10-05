import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import DragDropOption from "@components/template/createForm/DragDropOption";
import DragDrop from "@components/template/createForm/DragDrop";
import Spinner from "@components/template/Spinner";
import { request } from "@services/apiService.js";
import UseFormData from "@hooks/UseFormEditor.js";

const CreateForm = () => {
  const location = useLocation();
  const { id, name } = location.state || {};

  const [boxInfo, setBoxInfo] = useState(() => {
    const savedBoxInfo = localStorage.getItem("boxInfo");
    return savedBoxInfo
      ? JSON.parse(savedBoxInfo)
      : {
          width: 300,
          height: 300,
          borderTop: 0,
          borderBottom: 0,
          borderLeft: 0,
          borderRight: 0,
          borderColor: "#c2c2c2",
          borderRadius: 5,
          bgColor: "rgba(194, 194, 194, 1)",
          bgImg: "",
          opacity: "1",
        };
  });

  const prevBoxInfo = useRef(boxInfo);

  useEffect(() => {
    if (JSON.stringify(prevBoxInfo.current) !== JSON.stringify(boxInfo)) {
      localStorage.setItem("boxInfo", JSON.stringify(boxInfo));
      prevBoxInfo.current = boxInfo;
    }
  }, [boxInfo]);

  const [itemAbility, setItemAbility] = useState({
    edit: false,
    remove: false,
    controller: false,
    dragDisabled: false,
    moveTo: false,
  });

  const [componentsList, setComponentsList] = useState([]);
  const [points, setPoints] = useState([]);

  // For manage the send button and update button the form
  const [btnDisplayStatus, setBtnDisplayStatus] = useState(true);

  const { data, isLoading, error } = useQuery(
    ["GetForms"],
    () =>
      request({
        method: "GET",
        url: "/api/forms",
      }),
    { enabled: !!id && !!name },
  );

  UseFormData(data, id, setBoxInfo, setBtnDisplayStatus);

  const dragDropProps = {
    boxInfo,
    componentsList,
    setComponentsList,
    points,
    setPoints,
    itemAbility,
  };

  const dragDropOptionProps = {
    ...dragDropProps,
    setBoxInfo,
    setItemAbility,
    btnDisplayStatus,
    setBtnDisplayStatus,
    formId: id,
    formName: name,
  };

  return (
    <div className="h-[110vh] w-full flex flex-row gap-3 justify-center items-center xl:items-start overflow-auto max-xl:flex-col max-xl:justify-start bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
      {isLoading && <Spinner />}
      {error && <p className="text-red-500">{error.message}</p>}
      {!isLoading && !error && (
        <>
          <div className="w-full md:w-9/12 xl:w-7/12 2xl:w-8/12 h-full">
            <DragDrop {...dragDropProps} />
          </div>
          <div className="w-full md:w-9/12 xl:w-5/12 2xl:w-4/12 h-full 2xl:mr-2">
            <DragDropOption {...dragDropOptionProps} />
          </div>
        </>
      )}
    </div>
  );
};

export default CreateForm;
