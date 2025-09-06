import { Button, Modal } from "antd";

export default function DeleteModal({
  title,
  isOpenModal,
  setIsOpenModal,
  onDelete,
  loading = false,
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
          loading={loading}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
            setTimeout(() => {
              setIsOpenModal(false);
            }, 2000);
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
