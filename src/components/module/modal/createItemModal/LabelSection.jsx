import { Select, Spin } from "antd";
import { Field } from "formik";
import DeviceOfLabelCard from "@module/card/DeviceOfLabelCard.jsx";

const LabelSection = ({
  values,
  optionsDevices,
  selectedDeviceId,
  setSelectedDeviceId,
  selectDevice,
  setSelectDevice,
  setFieldValue,
  isLoadingDevices,
  optionsRegisters,
  devicesError,
  registersData,
  showImgsOrColors,
  setShowImgsOrColors,
  optionsCategories,
  setSelectedCategorie,
  isLoadingImgs,
  imgsError,
  imgs,
  setBetData,
  isLoadingRegisters,
  registersError,
}) => {
  return (
    <>
      {values.type === "label" && (
        <>
          <Field
            type="text"
            name="title"
            placeholder="Title"
            className="border-2 border-gray-200 py-[0.20rem] px-3 rounded-md w-full outline-none"
          />

          <div className="flex items-center gap-2">
            <Field
              type="checkbox"
              id="selectDevice"
              name="selectDevice"
              checked={selectDevice}
              onChange={() => setSelectDevice(!selectDevice)}
              className="w-4 h-4"
            />
            <label
              htmlFor="selectDevice"
              className="text-sm cursor-pointer font-bold"
            >
              Choose Device
            </label>
          </div>

          <DeviceOfLabelCard
            selectDevice={selectDevice}
            selectedDeviceId={selectedDeviceId}
            setSelectedDeviceId={setSelectedDeviceId}
            optionsDevices={optionsDevices}
            isLoadingDevices={isLoadingDevices}
            registersError={registersError}
            setFieldValue={setFieldValue}
            isLoadingRegisters={isLoadingRegisters}
            devicesError={devicesError}
            registersData={registersData}
            optionsRegisters={optionsRegisters}
          />

          {values.temp && (
            <Select
              className="customSelect ant-select-selector w-full"
              placeholder="Type data"
              onChange={(value) => setFieldValue("typeDataRegister", value)}
            >
              <Option value="string">String</Option>
              <Option value="binary">Binary</Option>
              <Option value="integer">Integer</Option>
              <Option value="float">Float</Option>
              <Option value="boolean">Boolean</Option>
            </Select>
          )}

          {values.typeDataRegister === "binary" && (
            <Select
              className="customSelect w-full"
              placeholder="Number bits"
              onChange={(value) => setFieldValue("numberBits", value)}
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">6</Option>
              <Option value="6">6</Option>
              <Option value="7">7</Option>
              <Option value="8">8</Option>
              <Option value="9">9</Option>
              <Option value="10">10</Option>
              <Option value="11">11</Option>
              <Option value="12">12</Option>
              <Option value="13">13</Option>
              <Option value="14">14</Option>
              <Option value="15">15</Option>
              <Option value="16">16</Option>
            </Select>
          )}

          {(values.typeDataRegister === "boolean" ||
            values.typeDataRegister === "binary") && (
            <div className="flex flex-row justify-row items-center">
              <div className="w-1/2 flex flex-row justify-start items-center gap-2">
                <Field
                  type="radio"
                  id="chooseColorsForBg"
                  name="bgOption"
                  value="colors"
                  checked={showImgsOrColors === "colors"}
                  onChange={() => setShowImgsOrColors("colors")}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="chooseColorsForBg"
                  className="text-sm font-bold cursor-pointer"
                >
                  Choose Color
                </label>
              </div>

              <div className="w-1/2 flex flex-row justify-start items-center gap-2">
                <Field
                  type="radio"
                  id="chooseImgsForBg"
                  name="bgOption"
                  value="images"
                  checked={showImgsOrColors === "images"}
                  onChange={() => setShowImgsOrColors("images")}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="chooseImgsForBg"
                  className="text-sm font-bold cursor-pointer"
                >
                  Choose Imgs
                </label>
              </div>
            </div>
          )}

          {values.typeDataRegister === "boolean" &&
            showImgsOrColors === "colors" && (
              <div className="w-full flex flex-row justify-center items-center gap-1">
                <label className="w-1/2 flex flex-row justify-start items-center gap-1 text-sm font-bold bg-blue-50 runded-md p-2">
                  Color in true :
                  <input
                    type="color"
                    name="backgroundColorBooleanTrue"
                    value={values.backgroundColorBooleanTrue}
                    onChange={(e) =>
                      setFieldValue(
                        "backgroundColorBooleanTrue",
                        e.target.value,
                      )
                    }
                  />
                </label>
                <label className="w-1/2 flex flex-row justify-start items-center gap-1 text-sm font-bold bg-blue-50 runded-md p-2">
                  Color in fasle :
                  <input
                    type="color"
                    name="backgroundColorBooleanFalse"
                    value={values.backgroundColorBooleanFalse}
                    onChange={(e) =>
                      setFieldValue(
                        "backgroundColorBooleanFalse",
                        e.target.value,
                      )
                    }
                  />
                </label>
              </div>
            )}

          {values.typeDataRegister === "binary" &&
            showImgsOrColors === "colors" && (
              <div className="w-full h-auto flex flex-row justify-center items-center gap-1">
                <label className="w-1/2 text-sm font-bold flex flex-row justify-start items-center gap-1 bg-blue-50 rounded-md p-2">
                  Color in 0 :
                  <input
                    type="color"
                    name="backgroundColorBinaryZero"
                    value={values.backgroundColorBinaryZero}
                    onChange={(e) =>
                      setFieldValue("backgroundColorBinaryZero", e.target.value)
                    }
                  />
                </label>
                <label className="w-1/2 text-sm font-bold flex flex-row justify-start items-center gap-1 bg-blue-50 rounded-md p-2">
                  Color in 1 :
                  <input
                    type="color"
                    name="backgroundColorBinaryOne"
                    value={values.backgroundColorBinaryOne}
                    onChange={(e) =>
                      setFieldValue("backgroundColorBinaryOne", e.target.value)
                    }
                  />
                </label>
              </div>
            )}

          {showImgsOrColors === "images" &&
            (values.typeDataRegister === "boolean" ||
              values.typeDataRegister === "binary") && (
              <Select
                showSearch
                className="customSelect ant-select-selector w-full"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                placeholder="Choose category"
                options={optionsCategories}
                onChange={(value) => setSelectedCategorie(value)}
              />
            )}

          {values.typeDataRegister === "boolean" &&
            showImgsOrColors === "images" && (
              <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                {isLoadingImgs ? (
                  <Spin />
                ) : imgsError ? (
                  <div>{imgsError}</div>
                ) : (
                  <div className="w-full flex flex-col justify-center items-start gap-2">
                    <p className="font-bold text-sm">Img in true</p>
                    <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                      <div
                        onClick={() =>
                          setFieldValue("backgroundImageBooleanTrue", "")
                        }
                        className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                          values.backgroundImageBooleanTrue === ""
                            ? "border-blue-500 shadow-xl"
                            : "border-transparent"
                        } flex items-center justify-center bg-gray-200 shadow p-1`}
                      >
                        <span className="w-full h-full flex flex-row justify-center items-center text-gray-500 bg-gray-300 font-bold text-[0.70rem] rounded-md">
                          No Image
                        </span>
                      </div>
                      {imgs.map((img, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            setFieldValue(
                              "backgroundImageBooleanTrue",
                              img.path,
                            )
                          }
                          className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                            values.backgroundImageBooleanTrue === img.path
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
            )}

          {values.typeDataRegister === "boolean" &&
            showImgsOrColors === "images" && (
              <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                {isLoadingImgs ? (
                  <Spin />
                ) : imgsError ? (
                  <div>{imgsError}</div>
                ) : (
                  <div className="w-full flex flex-col justify-center items-start gap-2">
                    <p className="font-bold text-sm">Img in false</p>
                    <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                      <div
                        onClick={() =>
                          setFieldValue("backgroundImageBooleanFalse", "")
                        }
                        className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                          values.backgroundImageBooleanFalse === ""
                            ? "border-blue-500 shadow-xl"
                            : "border-transparent"
                        } flex items-center justify-center bg-gray-200 shadow p-1`}
                      >
                        <span className="w-full h-full flex flex-row justify-center items-center text-gray-500 bg-gray-300 font-bold text-[0.70rem] rounded-md">
                          No Image
                        </span>
                      </div>
                      {imgs.map((img, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            setFieldValue(
                              "backgroundImageBooleanFalse",
                              img.path,
                            )
                          }
                          className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                            values.backgroundImageBooleanFalse === img.path
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
            )}

          {values.typeDataRegister === "binary" &&
            showImgsOrColors === "images" && (
              <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                {isLoadingImgs ? (
                  <Spin />
                ) : imgsError ? (
                  <div>{imgsError}</div>
                ) : (
                  <div className="w-full flex flex-col justify-center items-start gap-2">
                    <p className="font-bold text-sm">Img in 0</p>
                    <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                      <div
                        onClick={() =>
                          setFieldValue("backgroundImageBinaryZero", "")
                        }
                        className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                          values.backgroundImageBinaryZero === ""
                            ? "border-blue-500 shadow-xl"
                            : "border-transparent"
                        } flex items-center justify-center bg-gray-200 shadow p-1`}
                      >
                        <span className="w-full h-full flex flex-row justify-center items-center text-gray-500 bg-gray-300 font-bold text-[0.70rem] rounded-md">
                          No Image
                        </span>
                      </div>
                      {imgs.map((img, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            setFieldValue("backgroundImageBinaryZero", img.path)
                          }
                          className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                            values.backgroundImageBinaryZero === img.path
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
            )}

          {values.typeDataRegister === "binary" &&
            showImgsOrColors === "images" && (
              <div className="w-full flex flex-row justify-center items-center bg-blue-50 p-3 rounded-lg">
                {isLoadingImgs ? (
                  <Spin />
                ) : imgsError ? (
                  <div>{imgsError}</div>
                ) : (
                  <div className="w-full flex flex-col justify-center items-start gap-2">
                    <p className="font-bold text-sm">Img in 1</p>
                    <div className="w-full flex flex-row flex-wrap justify-start items-start gap-2">
                      <div
                        onClick={() =>
                          setFieldValue("backgroundImageBinaryOne", "")
                        }
                        className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                          values.backgroundImageBinaryOne === ""
                            ? "border-blue-500 shadow-xl"
                            : "border-transparent"
                        } flex items-center justify-center bg-gray-200 shadow p-1`}
                      >
                        <span className="w-full h-full flex flex-row justify-center items-center text-gray-500 bg-gray-300 font-bold text-[0.70rem] rounded-md">
                          No Image
                        </span>
                      </div>
                      {imgs.map((img, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            setFieldValue("backgroundImageBinaryOne", img.path)
                          }
                          className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                            values.backgroundImageBinaryOne === img.path
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
            )}

          {values.typeDataRegister === "binary" && (
            <div className="flex flex-row justify-center items-center gap-1">
              <div className="w-1/2 flex flex-row justify-start items-center gap-2 p-2 bg-blue-50 rounded-md">
                <Field
                  type="checkbox"
                  id="hideIfZero"
                  name="hideIfZero"
                  checked={values.hideIfZero}
                  onChange={() =>
                    setFieldValue("hideIfZero", !values.hideIfZero)
                  }
                  className="w-4 h-4"
                />
                <label
                  htmlFor="hideIfZero"
                  className="text-sm cursor-pointer font-bold"
                >
                  If 0, it's hidden.
                </label>
              </div>
              <div className="w-1/2 flex flex-row justify-start items-center gap-2 p-2 bg-blue-50 rounded-md">
                <Field
                  type="checkbox"
                  id="hideIfOne"
                  name="hideIfOne"
                  checked={values.hideIfOne}
                  onChange={() => setFieldValue("hideIfOne", !values.hideIfOne)}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="hideIfOne"
                  className="text-sm font-bold cursor-pointer"
                >
                  If 1, it's hidden.
                </label>
              </div>
            </div>
          )}

          {values.temp &&
            (values.typeDataRegister === "integer" ||
              values.typeDataRegister === "binary") && (
              <div className="h-auto flex flex-row justify-center items-end gap-1">
                <Select
                  className="customSelect w-full"
                  placeholder="Condition definition"
                  onChange={(value) => {
                    setBetData((prevState) => ({
                      ...prevState,
                      bet: value,
                    }));
                  }}
                >
                  <Option value="bigger">greater than &gt;</Option>
                  <Option value="smaller">less than &lt;</Option>
                  <Option value="equal">equal = </Option>
                  <Option value="GreaterThanOrEqual">
                    greater than or equal &gt;=
                  </Option>
                  <Option value="LessThanOrEqual">
                    less than or equal &lt;=
                  </Option>
                </Select>
              </div>
            )}
        </>
      )}
    </>
  );
};

export default LabelSection;
