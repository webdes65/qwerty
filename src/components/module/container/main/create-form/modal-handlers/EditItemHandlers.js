import { useEffect } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { setItems } from "@redux_toolkit/features/itemsSlice.js";
import { request } from "@services/apiService.js";

export default function EditItemHandlers({
  setOptionsCategories,
  selectedCategory,
  setImages,
  setOptionsDevices,
  selectedDeviceId,
  setOptionsRegisters,
  items,
  item,
  setIsOpenEditModal,
}) {
  const dispatch = useDispatch();
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery(["getCategories"], () =>
    request({ method: "GET", url: "/api/categories" }),
  );

  useEffect(() => {
    if (categoriesData) {
      const newOptions = categoriesData.data.map((cat) => ({
        label: cat.title,
        value: cat.uuid,
      }));
      setOptionsCategories([{ label: "All", value: 0 }, ...newOptions]);
    }
  }, [categoriesData]);

  // Images
  const {
    data: imagesData,
    isLoading: isLoadingImages,
    error: imagesError,
  } = useQuery(["fetchImgsCategory", selectedCategory], () =>
    request({ method: "GET", url: `/api/files?category=${selectedCategory}` }),
  );

  useEffect(() => {
    if (imagesData) setImages(imagesData.data);
  }, [imagesData]);

  // Devices
  const {
    data: devicesData,
    isLoading: isLoadingDevices,
    error: devicesError,
  } = useQuery(["getDevices"], () =>
    request({ method: "GET", url: "/api/devices" }),
  );

  useEffect(() => {
    if (devicesData) {
      const newOptions = devicesData.data.map((dev) => ({
        label: dev.name,
        value: dev.uuid,
      }));
      setOptionsDevices(newOptions);
    }
  }, [devicesData]);

  // Registers
  const {
    data: registersData,
    isLoading: isLoadingRegisters,
    error: registersError,
  } = useQuery(
    ["getRegisters", selectedDeviceId],
    () =>
      request({
        method: "GET",
        url: `/api/registers?device_id=${selectedDeviceId}`,
      }),
    { enabled: !!selectedDeviceId },
  );

  useEffect(() => {
    if (registersData) {
      const newOptions = registersData.data.map((reg) => ({
        label: `${reg.title} (${reg.uuid})`,
        value: reg.uuid,
      }));
      setOptionsRegisters(newOptions);
    }
  }, [registersData]);

  const handlerSubmit = (values) => {
    const updatedItems = items.map((i) =>
      i.position.x === item.position.x && i.position.y === item.position.y
        ? { ...i, ...values }
        : i,
    );
    dispatch(setItems(updatedItems));
    localStorage.setItem("registers", JSON.stringify(updatedItems));
    setIsOpenEditModal(false);
  };

  return {
    isLoadingCategories,
    categoriesError,
    isLoadingImages,
    imagesError,
    isLoadingDevices,
    devicesError,
    registersData,
    isLoadingRegisters,
    registersError,
    handlerSubmit,
  };
}
