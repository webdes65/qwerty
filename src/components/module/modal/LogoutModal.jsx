import { Button, Modal } from "antd";

export default function LogoutModal({
  title,
  isOpenModal,
  setIsOpenModal,
  onLogout,
}) {
  return (
    <Modal
      className="font-Quicksand"
      title={title}
      open={isOpenModal}
      onCancel={() => setIsOpenModal(false)}
      footer={null}
      width={600}
    >
      <div className="flex items-center justify-evenly mt-3 md:mt-6">
        <Button
          type="default"
          htmlType="button"
          onClick={() => setIsOpenModal(false)}
        >
          Cancel
        </Button>

        <Button
          type="primary"
          danger
          htmlType="button"
          onClick={(e) => {
            e.stopPropagation();
            onLogout();
          }}
        >
          Logout
        </Button>
      </div>
    </Modal>
  );
}
