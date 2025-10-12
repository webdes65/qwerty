import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { IoLogoDropbox } from "react-icons/io5";
import ARProjectSubprojectSkeleton from "@components/module/card/ARProjectSubprojectSkeleton";
import FormCard from "@components/module/card/FormCard";
import { request } from "@services/apiService.js";

const Forms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [optionsCategories, setOptionsCategories] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

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

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setDebouncedSearchTerm("");
    setSearchResults(null);
  };

  return (
    <div className="w-full h-[90vh] flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2 bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2 mt-5">
        <div className="w-full md:w-2/3 px-2">
          <Input
            size="large"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            prefix={
              <SearchOutlined className="text-dark-100 dark:text-white" />
            }
            className="font-Quicksand text-dark-100 dark:text-white border-2 border-gray-200 dark:border-gray-500"
            allowClear
          />
        </div>

        <div className="w-full md:w-1/3 flex flex-row gap-2 items-center">
          <Select
            className="customSelect w-full !h-10 md:mr-2 font-Quicksand font-medium placeholder:font-medium"
            options={processedOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Categories"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />

          {(searchTerm || (selectedCategory && selectedCategory !== 0)) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 rounded-md transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <ul className="w-full h-auto mb-20 lg:mb-0 flex flex-row justify-start items-start flex-wrap">
        {isLoading ? (
          <>
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
          </>
        ) : forms.length === 0 ? (
          <div className="w-full h-full flex flex-col justify-center items-center font-Quicksand uppercase font-bold bg-gray-200 dark:bg-gray-100 rounded-md shadow">
            <IoLogoDropbox className="text-[5rem] text-gray-400" />
            <p className="text-gray-500 cursor-default">
              {searchTerm || (selectedCategory && selectedCategory !== 0)
                ? "No forms found matching your criteria"
                : "No Data"}
            </p>
          </div>
        ) : (
          forms.map((form, index) => (
            <FormCard key={form.uuid || index} form={form} />
          ))
        )}
      </ul>

      {(debouncedSearchTerm || (selectedCategory && selectedCategory !== 0)) &&
        forms.length > 0 &&
        !isLoading && (
          <div className="w-full text-center text-sm text-gray-600 mt-2">
            Found {forms.length} form{forms.length !== 1 ? "s" : ""}
            {debouncedSearchTerm && selectedCategory && selectedCategory !== 0
              ? ` for "${debouncedSearchTerm}" in selected category`
              : debouncedSearchTerm
                ? ` for "${debouncedSearchTerm}"`
                : " in selected category"}
          </div>
        )}
    </div>
  );
};

export default Forms;
