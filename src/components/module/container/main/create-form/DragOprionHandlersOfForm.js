import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { setItems } from "@redux_toolkit/features/itemsSlice.js";
import { request } from "@services/apiService.js";
import FormHTML from "@template/FormHTML.js";
import logger from "@utils/logger.js";

export default function DragOptionHandlersOfForm({
  setOptionsCategories,
  selectedCategory,
  setImages,
  dispatch,
  setBoxInfo,
  isDefault,
  formId,
  setItemAbility,
  updatedName,
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery(["getCategories"], () =>
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
      const allOption = { label: "All", value: 0 };
      setOptionsCategories([allOption, ...newOptions]);
    }
  }, [categoriesData]);

  const {
    data: imagesData,
    isLoading: isLoadingImages,
    error: imagesError,
  } = useQuery(["fetchImagesCategory", selectedCategory], () =>
    request({
      method: "GET",
      url: `/api/files?category=${selectedCategory}`,
    }),
  );

  useEffect(() => {
    if (imagesData) {
      setImages(imagesData.data);
    }
  }, [imagesData]);

  const postForm = useMutation(
    (data) => request({ method: "POST", url: "/api/forms", data }),
    {
      onSuccess: async (data) => {
        toast.success(data.status);
        queryClient.invalidateQueries("GetForms");

        const formId = data.data.uuid;

        if (formId) {
          const container = document.querySelector(".dragdrop-container");
          if (container) {
            const dropBox = document.getElementById("dropBox");
            if (dropBox) {
              dropBox.setAttribute("data-idform", formId);
            }
            const content = FormHTML(container);

            await request({
              method: "PATCH",
              url: `/api/forms/${formId}`,
              data: { content },
            })
              // .then((res) => {
              // })
              .catch((err) => {
                logger.log(err);
              });
          }
        }

        dispatch(setItems([]));
        localStorage.removeItem("registers");
        setBoxInfo({
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
        });
        localStorage.removeItem("loadEchoRegisters");
        setName("");
      },
      onError: (error) => {
        toast.error(error.data.message);
      },
    },
  );

  // For Submit Form
  useEffect(() => {
    if (name) {
      const registers = JSON.parse(localStorage.getItem("registers"));
      const defaultBoxInfo = {
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

      let boxInfo = JSON.parse(localStorage.getItem("boxInfo"));

      if (boxInfo === null) {
        boxInfo = defaultBoxInfo;
      }

      const objects = JSON.stringify({
        boxInfo,
        registers,
      });

      postForm.mutate({
        name,
        objects,
        category: selectedCategory === 0 ? null : selectedCategory,
        default_building: isDefault,
      });
    }
  }, [name]);

  const updateForm = useMutation(
    (data) =>
      request({
        method: "PATCH",
        url: `/api/forms/${formId}`,
        data,
      }),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        dispatch(setItems([]));
        localStorage.removeItem("registers");
        setBoxInfo({
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
        });
        localStorage.removeItem("loadEchoRegisters");
        setName("");
      },
      onError: (error) => {
        toast.error(error.data.message);
      },
    },
  );

  const handleUpdate = async (formName, category) => {
    await setItemAbility((prev) => ({ ...prev, edit: false }));
    await setItemAbility((prev) => ({ ...prev, remove: false }));
    await setItemAbility((prev) => ({ ...prev, controller: false }));

    if (formId) {
      const container = document.querySelector(".dragdrop-container");
      if (container) {
        const dropBox = document.getElementById("dropBox");
        if (dropBox) {
          dropBox.setAttribute("data-idform", formId);
        }
        const content = FormHTML(container);
        const registers = JSON.parse(localStorage.getItem("registers"));
        const boxInfo = JSON.parse(localStorage.getItem("boxInfo"));

        const objects = JSON.stringify({
          boxInfo,
          registers,
        });

        updateForm.mutate({
          name: formName || updatedName,
          content,
          objects,
          category:
            category !== undefined
              ? category === 0
                ? null
                : category
              : selectedCategory === 0
                ? null
                : selectedCategory,
        });
      } else {
        logger.log("dragdrop-container element not found.");
        toast.error("dragdrop-container element not found.");
      }
    }
  };

  return {
    setName,
    isLoadingCategories,
    categoriesError,
    isLoadingImages,
    imagesError,
    handleUpdate,
  };
}
