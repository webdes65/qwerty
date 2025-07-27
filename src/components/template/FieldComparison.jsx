import { useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { request } from "../../services/apiService";
import { useQuery } from "react-query";
import { useState } from "react";
import { Select, Spin } from "antd";

const FieldComparison = ({ betData, setBetData }) => {
  const [optionsCategories, setOptionsCategories] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState(0);
  const [categoryImages, setCategoryImages] = useState({});

  const { data: categoriesData } = useQuery(["getCategories"], () =>
    request({
      method: "GET",
      url: "/api/categories",
    })
  );

  useEffect(() => {
    if (categoriesData) {
      const newOptions = categoriesData.data.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      const allOption = { label: "All", value: 0 };
      setOptionsCategories([allOption, ...newOptions]);
    }
  }, [categoriesData]);

  const {
    data: imgsData,
    isLoading: isLoadingImgs,
    error: imgsError,
  } = useQuery(
    ["fetchImgsCategory", selectedCategorie],
    () =>
      request({
        method: "GET",
        url: `/api/files?category=${selectedCategorie}`,
      }),
    {
      enabled: !!categoriesData,
    }
  );

  useEffect(() => {
    if (imgsData) {
      setCategoryImages((prev) => ({
        ...prev,
        [selectedCategorie]: imgsData.data,
      }));
    }
  }, [imgsData, selectedCategorie]);

  const handleAddField = () => {
    const newField = {
      id: `${(betData.betList && betData.betList.length) + 1}`,
      key: `${betData.bet}`,
      value: "",
      color: "#ffffff",
      visibility: false,
      bgImg: "",
      category: 1,
    };

    setBetData((prevState) => ({
      ...prevState,
      betList: [...betData.betList, newField],
    }));
  };

  const handleFieldChange = (index, key, newValue) => {
    setBetData((prevState) => ({
      ...prevState,
      betList: betData.betList.map((field, i) =>
        i === index ? { ...field, [key]: newValue } : field
      ),
    }));
  };

  return (
    <div className="w-full flex flex-col justify-center items-start gap-2">
      <button
        type="button"
        onClick={() => {
          handleAddField();
        }}
        className="w-full h-auto flex flex-row justify-center items-center bg-blue-500 text-white rounded-md shadow"
      >
        <IoIosAdd className="text-3xl" />
      </button>

      <div className="w-full h-auto flex flex-col justify-center items-center gap-2">
        {betData.betList.map((field, index) => (
          <div
            key={field.id}
            className="w-full flex flex-col justify-center items-center gap-2 border-2 border-dashed border-gray-200 rounded-md p-2"
          >
            <input
              className="w-full h-full border-2 border-gray-200 rounded-md py-[0.20rem] px-3 outline-none"
              type="text"
              placeholder={field.key}
              value={field.value}
              onChange={(e) =>
                handleFieldChange(index, "value", e.target.value)
              }
            />

            <div className="w-full flex flex-row justify-center items-center">
              <div className="w-1/2 h-auto flex flex-row justify-start items-center gap-2">
                <p className="w-auto h-full text-sm text-gray-500 font-bold">
                  Color :
                </p>
                <input
                  type="color"
                  value={field.color}
                  onChange={(e) =>
                    handleFieldChange(index, "color", e.target.value)
                  }
                />
              </div>
              <label className="w-1/2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.visibility}
                  onChange={(e) =>
                    handleFieldChange(index, "visibility", e.target.checked)
                  }
                />
                <span className="text-sm text-gray-500 font-bold">
                  Visibility
                </span>
              </label>
            </div>

            <Select
              showSearch
              className="customSelect w-full font-Quicksand"
              placeholder="Choose Category"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              value={field.category}
              options={optionsCategories}
              onChange={(value) => {
                handleFieldChange(index, "category", value);
                setSelectedCategorie(value);
              }}
            />

            <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
              {isLoadingImgs ? (
                <Spin />
              ) : imgsError ? (
                <div>{imgsError}</div>
              ) : (
                <div className="w-full flex flex-row flex-wrap justify-start items-start gap-1">
                  <div
                    onClick={() => handleFieldChange(index, "bgImg", "")}
                    className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                      field.bgImg === ""
                        ? "border-blue-500 shadow-xl"
                        : "border-transparent"
                    } flex items-center justify-center bg-gray-200 shadow p-1`}
                  >
                    <span className="w-full h-full flex flex-row justify-center items-center text-gray-500 bg-gray-300 font-bold text-[0.70rem] rounded-md">
                      No Image
                    </span>
                  </div>
                  {categoryImages[field.category]?.map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      onClick={() =>
                        handleFieldChange(index, "bgImg", img.path)
                      }
                      className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                        field.bgImg === img.path
                          ? "border-blue-500 shadow-xl"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img.path}
                        alt={`Image ${imgIndex}`}
                        className="w-full h-full object-cover rounded-lg p-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldComparison;
