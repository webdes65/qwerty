import { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { IoLogoDropbox } from "react-icons/io5";
import FormCard from "@components/module/card/FormCard";
import SkeletonList from "@module/SkeletonList.jsx";
import FormIndexHandlers from "@module/container/main/form/FormIndexHandlers.js";
import DynamicSelectBox from "@module/field/DynamicSelectBox.jsx";

const Forms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const { forms, isLoading, processedOptions, setSearchResults } =
    FormIndexHandlers({ debouncedSearchTerm, searchTerm, selectedCategory });

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

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
          <DynamicSelectBox
            className="customSelect w-full !min-h-[46px] md:mr-2 font-Quicksand font-medium placeholder:font-medium"
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
          <SkeletonList count={8} />
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
