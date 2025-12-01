import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function EditComponentHandlers({ selectedCategory }) {
  const [optionsCategories, setOptionsCategories] = useState([]);
  const [images, setImages] = useState([]);

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
  } = useQuery(["fetchImgsCategory", selectedCategory], () =>
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

  const processedOptions = optionsCategories.map((option) => ({
    ...option,
    value: option.value,
  }));

  return { images, isLoadingImages, imagesError, processedOptions };
}
