import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { IoLogoDropbox } from "react-icons/io5";
import ARProjectSubprojectSkeleton from "@components/module/card/ARProjectSubprojectSkeleton";
import FormCard from "@components/module/card/FormCard";
import { request } from "@services/apiService.js";

const Forms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
      enabled: searchTerm.length === 0,
    },
  );

  const { data: searchData, isLoading: searchLoading } = useQuery(
    ["searchForms", debouncedSearchTerm],
    () => {
      return request({
        method: "GET",
        url: `/api/forms/search?q=${encodeURIComponent(debouncedSearchTerm)}`,
      });
    },
    {
      enabled: debouncedSearchTerm.length > 0,
    },
  );

  useEffect(() => {
    if (debouncedSearchTerm.length === 0) {
      setSearchResults(null);
    } else if (searchData) {
      setSearchResults(searchData.data);
    }
  }, [searchData, debouncedSearchTerm]);

  const forms =
    searchResults !== null ? searchResults : allFormsData?.data || [];
  const isLoading = searchTerm ? searchLoading : allFormsLoading;

  return (
    <div className="w-full h-[90vh] flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2">
      {/* Search Input */}
      <div className="w-full mb-4 px-2">
        <Input
          size="large"
          placeholder="Search forms..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          prefix={<SearchOutlined className="text-gray-400" />}
          className="font-Quicksand"
          allowClear
        />
        {isLoading && searchTerm && (
          <div className="text-sm text-gray-500 mt-2 text-center">
            Searching for "{debouncedSearchTerm}"...
          </div>
        )}
      </div>

      {/* Forms List */}
      <ul className="w-full h-auto flex flex-row justify-start items-start flex-wrap">
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
          <div className="w-full h-full flex flex-col justify-center items-center font-Quicksand uppercase font-bold bg-gray-200 rounded-md shadow">
            <IoLogoDropbox className="text-[5rem] text-gray-400" />
            <p className="text-gray-500 cursor-default">
              {searchTerm ? "No forms found matching your search" : "No Data"}
            </p>
          </div>
        ) : (
          forms.map((form, index) => (
            <FormCard key={form.uuid || index} form={form} />
          ))
        )}
      </ul>

      {/* Search Results Info */}
      {debouncedSearchTerm && forms.length > 0 && !isLoading && (
        <div className="w-full text-center text-sm text-gray-600 mt-2">
          Found {forms.length} form{forms.length !== 1 ? "s" : ""} for "
          {debouncedSearchTerm}"
        </div>
      )}
    </div>
  );
};

export default Forms;
