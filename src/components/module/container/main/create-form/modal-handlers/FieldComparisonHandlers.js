import { useEffect } from "react";
import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function FieldComparisonHandlers({
  setOptionsCategories,
  selectedCategory,
  setCategoryImages,
}) {
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
    data: imagesData,
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
      enabled: !!categoriesData,
    },
  );

  useEffect(() => {
    if (imagesData) {
      setCategoryImages((prev) => ({
        ...prev,
        [selectedCategory]: imagesData.data,
      }));
    }
  }, [imagesData, selectedCategory]);

  return { isLoadingImages, imagesError };
}
