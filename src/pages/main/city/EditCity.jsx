import { Button } from "antd";
import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const EditDevice = () => {
  const location = useLocation();
  const { city } = location.state || {};

  const initialValues = {
    name: city?.name || "",
    country: city?.country?.name || "",
  };

  const [isEditable, setIsEditable] = useState(false);

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2">
      <div className="w-full grid grid-cols-2 gap-4 p-4 bg-white rounded shadow">
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <Form className="w-full flex flex-col justify-center items-start gap-2 pt-6">
              <div className="flex flex-col w-full">
                <Field
                  id="name"
                  name="name"
                  disabled={!isEditable}
                  className={`w-full p-2 border-2 ${
                    isEditable ? "border-gray-200" : "border-gray-200"
                  } rounded`}
                />
              </div>
              <div className="flex flex-col w-full">
                <Field
                  id="country"
                  name="country"
                  disabled={!isEditable}
                  className={`w-full p-2 border-2 ${
                    isEditable ? "border-gray-200" : "border-gray-200"
                  } rounded`}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button
                  type="primary"
                  onClick={() => setIsEditable(!isEditable)}
                  className="font-Poppins py-3 px-6 text-[1rem] font-medium"
                >
                  {isEditable ? "Cancel" : "Edit"}
                </Button>
                {isEditable && (
                  <Button
                  
                    onClick={handleSubmit}
                    className="font-Poppins py-3 px-6 text-[1rem] font-medium border-2 border-gray-200"
                  >
                    Save
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditDevice;
