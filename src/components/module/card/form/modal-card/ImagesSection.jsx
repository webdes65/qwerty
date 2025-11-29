import { Spin } from "antd";

export default function ImagesSection({
  loading,
  error,
  headerText,
  images,
  onSelectNoImage,
  onSelectImage,
  selectedValue,
}) {
  return (
    <div className="w-full flex flex-row justify-center items-center bg-blue-50 dark:bg-gray-100 p-3 rounded-lg">
      {loading ? (
        <Spin />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="w-full flex flex-col justify-center items-start gap-2">
          <p className="font-bold text-sm">{headerText}</p>
          <div className="w-full max-h-44 flex flex-row flex-wrap justify-start items-start gap-2 overflow-auto">
            <div
              onClick={onSelectNoImage}
              className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                selectedValue === ""
                  ? "border-blue-500 shadow-xl"
                  : "border-transparent"
              } flex items-center justify-center bg-gray-200 shadow p-1`}
            >
              <span className="w-full h-full flex flex-row justify-center items-center text-gray-500 bg-gray-300 font-bold text-[0.70rem] rounded-md">
                No Image
              </span>
            </div>

            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => onSelectImage(img.path)}
                className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                  selectedValue === img.path
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
        </div>
      )}
    </div>
  );
}
