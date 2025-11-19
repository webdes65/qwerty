import { useEffect } from "react";
import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function CreateItemHandlers({
  setOptionsDevices,
  selectedDeviceId,
  setOptionsRegisters,
  setOptionsCategories,
  selectedCategory,
  setImages,
}) {
  const {
    data: devicesData,
    isLoading: isLoadingDevices,
    error: devicesError,
  } = useQuery(["getDevices"], () =>
    request({
      method: "GET",
      url: "/api/devices",
    }),
  );

  useEffect(() => {
    if (devicesData) {
      const newOptions = devicesData.data.map((item) => ({
        label: item.name,
        value: item.uuid,
      }));

      setOptionsDevices(newOptions);
    }
  }, [devicesData]);

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
    {
      enabled: !!selectedDeviceId,
    },
  );

  useEffect(() => {
    if (registersData) {
      const newOptions = registersData.data.map((item) => ({
        label: `${item.title} (${item.uuid})`,
        value: item.uuid,
      }));
      setOptionsRegisters(newOptions);
    }
  }, [registersData]);

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
      const allOption = { label: "All", value: 0 };
      setOptionsCategories([allOption, ...newOptions]);
    }
  }, [categoriesData]);

  const {
    data: imgsData,
    isLoading: isLoadingImages,
    error: imagesError,
  } = useQuery(
    ["fetchImgsCategory", selectedCategory],
    () =>
      request({
        method: "GET",
        url: `/api/files?category=${selectedCategory}`,
      }),
    {
      enabled: !!selectedCategory,
    },
  );

  useEffect(() => {
    imgsData && setImages(imgsData.data);
  }, [imgsData]);

  return {
    isLoadingDevices,
    devicesError,
    registersData,
    isLoadingRegisters,
    registersError,
    isLoadingImages,
    imagesError,
  };
}
