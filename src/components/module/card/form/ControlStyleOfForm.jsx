import { Slider } from "antd";
import { hexToRgba, rgbaToHex } from "@utils/colorConverters.js";
import "@styles/allRepeatStyles.css";

export default function ControlStyleOfForm({ boxInfo, setBoxInfo }) {
  return (
    <>
      <div className="w-full flex flex-col justify-center items-start gap-2">
        <label className="labelStyle">Box size</label>
        <div className="w-full flex flex-col justify-center items-start gap-2 max-xl:flex-col max-xl:items-start">
          <div className="dragParentInputStyle">
            <input
              type="number"
              placeholder={`Width ${boxInfo.width}`}
              className="dragInputStyle"
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
              className="dragInputStyle"
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
        <label className="labelStyle">Border</label>
        <div className="w-full flex flex-col justify-center items-start gap-2 max-xl:flex-col max-xl:items-start">
          <div className="dragParentInputStyle">
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
              className="dragInputStyle"
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
              className="dragInputStyle"
            />
          </div>
          <div className="dragParentInputStyle">
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
              className="dragInputStyle"
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
              className="dragInputStyle"
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
          <label className="labelStyle">Border color</label>
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
          <label className="labelStyle">Background color</label>
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
