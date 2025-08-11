import React, { useState } from "react";
import Modal from "react-modal";
import { Select } from "antd";
// import axios from "axios";

Modal.setAppElement("#root");

const { Option } = Select;

const ChooseReqModal = ({ isChooseReqModal, setIsChooseReqModal }) => {
  const [reqs, setReqs] = useState([
    {
      title: "Req 1",
      path: "",
      method: "GET",
      keyValues: [],
      responses: [{ responseTitle: "", responseType: "string" }],
    },
  ]);

  const handleAddPath = () => {
    const newTitle = `Req ${reqs.length + 1}`;
    setReqs([
      ...reqs,
      {
        title: newTitle,
        path: "",
        method: "GET",
        keyValues: [],
        responses: [{ responseTitle: "", responseType: "string" }],
      },
    ]);
  };

  const handlePathChange = (index, value) => {
    const updatedReqs = [...reqs];
    updatedReqs[index].path = value;
    setReqs(updatedReqs);
  };

  const handleMethodChange = (index, method) => {
    const updatedReqs = [...reqs];
    updatedReqs[index].method = method;
    setReqs(updatedReqs);
  };

  const handleAddKeyValue = (index) => {
    const updatedReqs = [...reqs];
    updatedReqs[index].keyValues.push({ key: "", value: "" });
    setReqs(updatedReqs);
  };

  const handleKeyValueChange = (reqIndex, keyValueIndex, field, value) => {
    const updatedReqs = [...reqs];
    updatedReqs[reqIndex].keyValues[keyValueIndex][field] = value;
    setReqs(updatedReqs);
  };

  const handleResponseChange = (reqIndex, responseIndex, field, value) => {
    const updatedReqs = [...reqs];
    updatedReqs[reqIndex].responses[responseIndex][field] = value;
    setReqs(updatedReqs);
  };

  const handleAddResponseField = (index) => {
    const updatedReqs = [...reqs];
    updatedReqs[index].responses.push({
      responseTitle: "",
      responseType: "string",
    });
    setReqs(updatedReqs);
  };

  const handleSubmit = async () => {
    localStorage.setItem("chooseReq", JSON.stringify(reqs));

    // try {
    //   for (const req of reqs) {
    //     let response;
    //     const { method, path, keyValues } = req;

    //     if (method === "GET") {
    //       response = await axios.get(path);
    //     } else if (method === "POST") {
    //       const data = keyValues.reduce((acc, { key, value }) => {
    //         acc[key] = value;
    //         return acc;
    //       }, {});
    //       response = await axios.post(path, data);
    //     }

    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  return (
    <Modal
      isOpen={isChooseReqModal}
      onRequestClose={() => setIsChooseReqModal(false)}
      contentLabel="Choose Request Paths"
      className="modal fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      style={{
        overlay: { zIndex: 1000 },
      }}
    >
      <div
        style={{ direction: "ltr" }}
        className="h-auto w-1/2 flex flex-col justify-center items-start gap-4 p-10 px-20 bg-white rounded-md font-Poppins max-sm:w-full max-sm:px-10"
      >
        <h2 className="text-lg font-bold">Choose Request Paths</h2>

        <div className="w-full flex flex-col gap-4">
          {reqs.map((req, reqIndex) => (
            <div key={reqIndex} className="flex flex-col gap-2">
              <input
                type="text"
                value={req.path}
                onChange={(e) => handlePathChange(reqIndex, e.target.value)}
                placeholder={req.title}
                className="border-2 border-gray-200 p-2 rounded-md outline-none w-full"
              />
              <Select
                className="w-full"
                value={req.method}
                onChange={(value) => handleMethodChange(reqIndex, value)}
                placeholder="Select Method"
              >
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
              </Select>
              {req.method === "POST" && (
                <div className="flex flex-col">
                  {req.keyValues.map((keyValue, keyValueIndex) => (
                    <div key={keyValueIndex} className="flex gap-2 pt-4">
                      <input
                        type="text"
                        value={keyValue.key}
                        onChange={(e) =>
                          handleKeyValueChange(
                            reqIndex,
                            keyValueIndex,
                            "key",
                            e.target.value,
                          )
                        }
                        placeholder="Key"
                        className="border-2 border-gray-200 p-2 rounded-md outline-none w-full"
                      />
                      <input
                        type="text"
                        value={keyValue.value}
                        onChange={(e) =>
                          handleKeyValueChange(
                            reqIndex,
                            keyValueIndex,
                            "value",
                            e.target.value,
                          )
                        }
                        placeholder="Value"
                        className="border-2 border-gray-200 p-2 rounded-md outline-none w-full"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddKeyValue(reqIndex)}
                    className="w-full px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm mt-3"
                  >
                    Add Key-Value
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-2 pt-3">
                {req.responses.map((response, responseIndex) => (
                  <div key={responseIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={response.responseTitle}
                      onChange={(e) =>
                        handleResponseChange(
                          reqIndex,
                          responseIndex,
                          "responseTitle",
                          e.target.value,
                        )
                      }
                      placeholder="Response Title"
                      className="border-2 border-gray-200 p-2 rounded-md outline-none w-full"
                    />
                    <Select
                      value={response.responseType}
                      onChange={(value) =>
                        handleResponseChange(
                          reqIndex,
                          responseIndex,
                          "responseType",
                          value,
                        )
                      }
                      className="w-full"
                      placeholder="Select Response Type"
                    >
                      <Option value="string">String</Option>
                      <Option value="binary">Binary</Option>
                      <Option value="integer">Integer</Option>
                      <Option value="float">Float</Option>
                    </Select>
                  </div>
                ))}
                <button
                  onClick={() => handleAddResponseField(reqIndex)}
                  className="mt-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                >
                  Add Response Field
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full h-auto flex flex-row gap-2">
          <button
            onClick={handleAddPath}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add new req
          </button>
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChooseReqModal;
