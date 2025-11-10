import { Slider } from "antd";
import { hexToRgba, rgbaToHex } from "@utils/colorConverters.js";

export default function ControlStyleOfForm({ boxInfo, setBoxInfo }) {
  return (
    <>
      <div className="w-full flex flex-col justify-center items-start gap-2">
        <label className="text-black dark:text-white font-bold">Box size</label>
        <div className="w-full flex flex-col justify-center items-start gap-2 max-xl:flex-col max-xl:items-start">
          <div className="w-full flex flex-row justify-center items-center">
            <input
              type="number"
              placeholder={`Width ${boxInfo.width}`}
              className="w-1/2 border-2  border-gray-200 dark:border-gray-600 p-2 rounded mr-2 outline-none text-dark-100 bg-white dark:bg-gray-100 dark:text-white"
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 300;
                setBoxInfo((prev) => ({
                  ...prev,
                  width: value,
                }));
              }}
            />
            <input
              type="number"
              placeholder={`Height ${boxInfo.height}`}
              className="w-1/2 border-2  border-gray-200 dark:border-gray-600 p-2 rounded mr-2 outline-none text-dark-100 bg-white dark:bg-gray-100 dark:text-white"
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 300;
                setBoxInfo((prev) => ({
                  ...prev,
                  height: value,
                }));
              }}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center items-start gap-2">
        <label className="text-black dark:text-white font-bold">Border</label>
        <div className="w-full flex flex-col justify-center items-start gap-2 max-xl:flex-col max-xl:items-start">
          <div className="w-full flex flex-row justify-center items-center">
            <input
              type="number"
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 0;
                setBoxInfo((prev) => ({
                  ...prev,
                  borderTop: value,
                }));
              }}
              placeholder={`Top ${boxInfo.borderTop}`}
              className="w-1/2 border-2  border-gray-200 dark:border-gray-600 p-2 rounded mr-2 outline-none text-dark-100 bg-white dark:bg-gray-100 dark:text-white"
            />
            <input
              type="number"
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 0;
                setBoxInfo((prev) => ({
                  ...prev,
                  borderBottom: value,
                }));
              }}
              placeholder={`Bottom ${boxInfo.borderTop}`}
              className="w-1/2 border-2  border-gray-200 dark:border-gray-600 p-2 rounded mr-2 outline-none text-dark-100 bg-white dark:bg-gray-100 dark:text-white"
            />
          </div>
          <div className="w-full flex flex-row justify-center items-center">
            <input
              type="number"
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 0;
                setBoxInfo((prev) => ({
                  ...prev,
                  borderLeft: value,
                }));
              }}
              placeholder={`Left ${boxInfo.borderLeft}`}
              className="w-1/2 border-2  border-gray-200 dark:border-gray-600 p-2 rounded mr-2 outline-none text-dark-100 bg-white dark:bg-gray-100 dark:text-white"
            />
            <input
              type="number"
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 0;
                setBoxInfo((prev) => ({
                  ...prev,
                  borderRight: value,
                }));
              }}
              placeholder={`Right ${boxInfo.borderRight}`}
              className="w-1/2 border-2  border-gray-200 dark:border-gray-600 p-2 rounded mr-2 outline-none text-dark-100 bg-white dark:bg-gray-100 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
        <div className="w-full h-auto">
          <label className="text-sm font-bold">
            Border radius
            <Slider
              min={0}
              max={50}
              step={1}
              value={boxInfo.borderRadius}
              onChange={(value) =>
                setBoxInfo((prev) => ({
                  ...prev,
                  borderRadius: value,
                }))
              }
            />
          </label>
        </div>

        <div className="w-full h-auto">
          <label className="text-sm font-bold">
            Opacity
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={boxInfo.opacity}
              onChange={(value) =>
                setBoxInfo((prev) => ({
                  ...prev,
                  opacity: value,
                }))
              }
            />
          </label>
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-2">
        <div className="w-full flex flex-row justify-start items-center gap-1">
          <label className="text-black dark:text-white font-bold">
            Border color
          </label>
          <input
            type="color"
            value={boxInfo.borderColor}
            onChange={(e) => {
              const hex = e.target.value;
              setBoxInfo((prev) => ({
                ...prev,
                borderColor: hex,
              }));
            }}
          />
        </div>

        <div className="w-full flex flex-row justify-start items-center gap-1">
          <label className="text-black dark:text-white font-bold">
            Background color
          </label>
          <input
            type="color"
            value={rgbaToHex(boxInfo.bgColor)}
            onChange={(e) => {
              const hex = e.target.value;
              const rgba = hexToRgba(hex, 1);
              setBoxInfo((prev) => ({
                ...prev,
                bgColor: rgba,
              }));
            }}
          />
        </div>
      </div>
    </>
  );
}
