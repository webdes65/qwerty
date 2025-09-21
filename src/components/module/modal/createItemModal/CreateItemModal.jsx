import { Modal } from "antd";
import CreateItemContent from "@module/modal/createItemModal/CreateItemContent.jsx";

const CreateItemModal = ({
  isOpenCreateModal,
  setIsOpenCreateModal,
  setComponentsList,
}) => {
  return (
    <Modal
      className="font-Quicksand"
      title="Create Item"
      open={isOpenCreateModal}
      onCancel={() => setIsOpenCreateModal(false)}
      footer={null}
    >
      <CreateItemContent
        setComponentsList={setComponentsList}
        setIsOpenCreateModal={setIsOpenCreateModal}
      />
    </Modal>
  );
};

export default CreateItemModal;
