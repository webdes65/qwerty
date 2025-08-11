import React from "react";
import { Modal } from "antd";

export default function UpdateFormNameModal({
  name,
  updatedName,
  setUpdatedName,
  openUpdateModal,
  setOpenUpdateModal,
  onConfirm,
}) {
  return (
    <Modal
      className="font-Quicksand"
      title={`Are you sure you want to change the name from ${name}?`}
      open={openUpdateModal}
      closable={false}
      onCancel={() => setOpenUpdateModal(false)}
      footer={[
        <div
          key="footer-buttons"
          className="flex flex-row justify-end items-center gap-1"
        >
          <button
            key="cancel"
            className="upload-imgs w-auto h-auto font-Quicksand font-bold !bg-red-200 !p-2 !shadow text-red-500 !rounded-md !text-[0.90rem] !border-[2.5px] !border-red-500"
            onClick={() => setOpenUpdateModal(false)}
          >
            Cancel
          </button>

          <button
            key="confirm"
            className="upload-imgs w-auto h-auto font-Quicksand font-bold !bg-blue-200 !p-2 !shadow text-blue-500 !rounded-md !text-[0.90rem] !border-[2.5px] !border-blue-500"
            type="primary"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>,
      ]}
    >
      {/* <Input
        className="!outline-none !ring-0 !focus:ring-0 !focus:outline-none border-2 border-gray-300"
        value={updatedName}
        onChange={(e) => setUpdatedName(e.target.value)}
        placeholder="Enter new form name"
        autoFocus
      /> */}

      <input
        type="text"
        value={updatedName}
        onChange={(e) => setUpdatedName(e.target.value)}
        className="w-full mt-1 border-2 border-gray-300 rounded-lg p-2 text-start cursor-text outline-none"
      />
    </Modal>
  );
}
