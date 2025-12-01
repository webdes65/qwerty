import { Select } from "antd";
import { Field } from "formik";
import ImagesSection from "@module/card/form/modal-card/ImagesSection.jsx";
import ControlColors from "@module/card/form/modal-card/ControlColors.jsx";

const BackgroundCustomization = ({ values, setFieldValue, props }) => {
  const isBoolean = values.typeDataRegister === "boolean";
  const isBinary = values.typeDataRegister === "binary";
  const shouldShow = isBoolean || isBinary;

  if (!shouldShow) return null;

  return (
    <>
      <div className="flex flex-row justify-row items-center">
        <div className="w-1/2 flex flex-row justify-start items-center gap-2">
          <Field
            type="radio"
            id="chooseColorsForBg"
            name="bgOption"
            value="colors"
            checked={props.showImagesOrColors === "colors"}
            onChange={() => props.setShowImagesOrColors("colors")}
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
            checked={props.showImagesOrColors === "images"}
            onChange={() => props.setShowImagesOrColors("images")}
            className="w-4 h-4"
          />
          <label
            htmlFor="chooseImgsForBg"
            className="text-sm font-bold cursor-pointer"
          >
            Choose Images
          </label>
        </div>
      </div>

      {props.showImagesOrColors === "colors" && (
        <>
          {isBoolean && (
            <div className="w-full flex flex-row justify-center items-center gap-1">
              <ControlColors
                label="Color in true :"
                name="backgroundColorBooleanTrue"
                value={values.backgroundColorBooleanTrue}
                onChange={(color) =>
                  setFieldValue("backgroundColorBooleanTrue", color)
                }
              />

              <ControlColors
                label="Color in false :"
                name="backgroundColorBooleanFalse"
                value={values.backgroundColorBooleanFalse}
                onChange={(color) =>
                  setFieldValue("backgroundColorBooleanFalse", color)
                }
              />
            </div>
          )}

          {isBinary && (
            <div className="w-full h-auto flex flex-row justify-center items-center gap-1">
              <ControlColors
                label="Color in 0 :"
                name="backgroundColorBinaryZero"
                value={values.backgroundColorBinaryZero}
                onChange={(color) =>
                  setFieldValue("backgroundColorBinaryZero", color)
                }
              />

              <ControlColors
                label="Color in 1 :"
                name="backgroundColorBinaryOne"
                value={values.backgroundColorBinaryOne}
                onChange={(color) =>
                  setFieldValue("backgroundColorBinaryOne", color)
                }
              />
            </div>
          )}
        </>
      )}

      {props.showImagesOrColors === "images" && (
        <>
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
            options={props.optionsCategories}
            onChange={(value) => props.setSelectedCategory(value)}
          />

          {isBoolean && (
            <>
              <ImagesSection
                loading={props.isLoadingImages}
                error={props.imagesError}
                headerText="Img in true"
                images={props.images}
                onSelectNoImage={() =>
                  setFieldValue("backgroundImageBooleanTrue", "")
                }
                onSelectImage={(path) =>
                  setFieldValue("backgroundImageBooleanTrue", path)
                }
                selectedValue={values.backgroundImageBooleanTrue}
              />

              <ImagesSection
                loading={props.isLoadingImages}
                error={props.imagesError}
                headerText="Img in false"
                images={props.images}
                onSelectNoImage={() =>
                  setFieldValue("backgroundImageBooleanFalse", "")
                }
                onSelectImage={(path) =>
                  setFieldValue("backgroundImageBooleanFalse", path)
                }
                selectedValue={values.backgroundImageBooleanFalse}
              />
            </>
          )}

          {isBinary && (
            <>
              <ImagesSection
                loading={props.isLoadingImages}
                error={props.imagesError}
                headerText="Img in 0"
                images={props.images}
                onSelectNoImage={() =>
                  setFieldValue("backgroundImageBinaryZero", "")
                }
                onSelectImage={(path) =>
                  setFieldValue("backgroundImageBinaryZero", path)
                }
                selectedValue={values.backgroundImageBinaryZero}
              />

              <ImagesSection
                loading={props.isLoadingImages}
                error={props.imagesError}
                headerText="Img in 1"
                images={props.images}
                onSelectNoImage={() =>
                  setFieldValue("backgroundImageBinaryOne", "")
                }
                onSelectImage={(path) =>
                  setFieldValue("backgroundImageBinaryOne", path)
                }
                selectedValue={values.backgroundImageBinaryOne}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default BackgroundCustomization;
