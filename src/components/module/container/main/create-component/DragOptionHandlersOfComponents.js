import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import { setComponents } from "@redux_toolkit/features/componentsSlice.js";
import logger from "@utils/logger.js";

export default function DragOptionHandlersOfComponents({
  setOptionsCategories,
  dropBoxRef,
  setIsOpenChooseNameModal,
  dispatch,
  setLines,
  components,
}) {
  const [name, setName] = useState("");

  const { data: categoriesData } = useQuery(["getCategories"], () =>
    request({
      method: "GET",
      url: "/api/categories",
    }),
  );

  useEffect(() => {
    if (categoriesData) {
      const newOptions = categoriesData.data.map((item) => ({
        label: item.title,
        value: item.uuid,
      }));
      setOptionsCategories(newOptions);
    }
  }, [categoriesData]);

  const submitComponent = () => {
    if (dropBoxRef.current) {
      setIsOpenChooseNameModal(true);
    }
  };

  const sendComponent = useMutation(
    (data) => request({ method: "POST", url: "/api/components", data }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        setName("");
        dispatch(setComponents([]));
        setLines([]);
      },
      onError: (error) => {
        logger.error(error);
      },
    },
  );

  useEffect(() => {
    if (name && dropBoxRef.current) {
      const data = {
        name,
        content: dropBoxRef.current.innerHTML,
      };
      sendComponent.mutate(data);
    }
  }, [name]);

  const RemoveAll = () => {
    if (components.length > 0) {
      dispatch(setComponents([]));
      setLines([]);
      toast.success("All components have been removed successfully!");
    } else {
      toast.info("No components to remove.");
    }
  };

  return { setName, submitComponent, RemoveAll };
}
