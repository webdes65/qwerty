import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { request } from "@services/apiService.js";

export default function FormIndexHandlers({
  searchTerm,
  selectedCategory,
  debouncedSearchTerm,
}) {
  const [searchResults, setSearchResults] = useState(null);
  const [optionsCategories, setOptionsCategories] = useState([]);

  const { data: allFormsData, isLoading: allFormsLoading } = useQuery(
    ["GetForms"],
    () =>
      request({
        method: "GET",
        url: "/api/forms",
      }),
    {
      enabled:
        searchTerm.length === 0 &&
        (selectedCategory === null || selectedCategory === 0),
    },
  );

  const { data: searchData, isLoading: searchLoading } = useQuery(
    ["searchForms", debouncedSearchTerm, selectedCategory],
    () => {
      let url = "/api/forms/search?";
      const params = new URLSearchParams();

      if (debouncedSearchTerm) {
        params.append("q", debouncedSearchTerm);
      }

      if (selectedCategory && selectedCategory !== 0) {
        params.append("category", selectedCategory);
      }

      return request({
        method: "GET",
        url: url + params.toString(),
      });
    },
    {
      enabled:
        debouncedSearchTerm.length > 0 ||
        (selectedCategory !== null && selectedCategory !== 0),
    },
  );

  useEffect(() => {
    if (
      debouncedSearchTerm.length === 0 &&
      (selectedCategory === null || selectedCategory === 0)
    ) {
      setSearchResults(null);
    } else if (searchData) {
      setSearchResults(searchData.data);
    }
  }, [searchData, debouncedSearchTerm, selectedCategory]);

  const forms =
    searchResults !== null ? searchResults : allFormsData?.data || [];
  const isLoading =
    searchTerm || (selectedCategory && selectedCategory !== 0)
      ? searchLoading
      : allFormsLoading;

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

  const processedOptions = (optionsCategories ?? []).map((option) => ({
    ...option,
    value: option.value,
  }));

  return { setSearchResults, forms, isLoading, processedOptions };
}
