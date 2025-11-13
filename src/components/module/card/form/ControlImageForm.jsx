import { Select, Spin } from "antd";

export default function ControlImageForm({
  selectedCategory,
  optionsCategories,
  setSelectedCategory,
  items,
  isLoadingImages,
  imagesError,
  images,
  setBoxInfo,
  boxInfo,
  setFieldValue,
  values,
}) {
  return (
    <>
      <div className="w-full flex flex-col justify-center items-start gap-1">
        <label className="font-bold">Choose a photo category</label>
        <Select
          showSearch
          className="customSelect ant-select-selector w-full h-[3rem] font-Quicksand font-medium"
          placeholder="Choose Category"
          optionFilterProp="label"
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          value={selectedCategory}
          options={optionsCategories}
          onChange={(value) => setSelectedCategory(value)}
        />
      </div>

      <div
        className={`w-full ${items.length > 0 ? "max-h-[13rem]" : "max-h-[22rem]"} overflow-auto flex flex-row justify-center items-start bg-blue-50 dark:bg-gray-100 p-3 rounded-lg`}
      >
        {isLoadingImages ? (
          <Spin />
        ) : imagesError ? (
          <div>{imagesError}</div>
        ) : images.length === 0 ? (
          <div className="w-full flex flex-row flex-wrap justify-center items-center gap-2">
            <div
              onClick={() => {
                if (setBoxInfo) {
                  setBoxInfo((prev) => ({
                    ...prev,
                    bgImg: "",
                  }));
                }

                setFieldValue("backgroundImage", "");
              }}
              className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                (boxInfo && boxInfo.bgImg === "") ||
                (values && values.backgroundImage === "")
                  ? "border-blue-500 shadow-xl"
                  : "border-transparent"
              } flex items-center justify-center bg-gray-200 shadow p-1`}
            >
              <span className="w-full h-full flex flex-row justify-center items-center text-gray-500 bg-gray-300 font-bold text-[0.70rem] rounded-md">
                No Image
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-auto flex flex-row flex-wrap justify-center items-center gap-2">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => {
                  if (setBoxInfo) {
                    setBoxInfo((prev) => ({
                      ...prev,
                      bgImg: img.path,
                    }));
                  }

                  setFieldValue("backgroundImage", img.path);
                }}
                className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                  (boxInfo && boxInfo.bgImg === img.path) ||
                  (values && values.backgroundImage === img.path)
                    ? "border-blue-500 shadow-xl"
                    : "border-transparent"
                }`}
              >
                <img
                  src={img.path}
                  alt={`Image ${index}`}
                  className="w-full h-full object-cover rounded-lg p-1"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
