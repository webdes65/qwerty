import { useState } from "react";
import { Modal } from "antd";

const ChoiceLngModal = ({
  isModalOpen,
  setIsModalOpen,
  setIsFirstTime,
  setSelectedLanguage,
  selectedLanguage,
}) => {
  const [focusedLanguage, setFocusedLanguage] = useState(selectedLanguage);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setIsModalOpen(false);
    setIsFirstTime(false);
    localStorage.setItem("isFirstTime", JSON.stringify(false));
  };

  const getButtonClass = (language) => {
    return `w-1/2 flex flex-row justify-center items-center bg-gray-200 border-2 uppercase ${
      focusedLanguage === language
        ? "border-green-500 bg-green-200 text-green-500"
        : "border-gray-300"
    } rounded-lg p-3`;
  };

  return (
    <Modal
      className="font-Quicksand"
      title="Choice language"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <div className="flex flex-col justify-center items-center gap-2 font-bold py-4">
        <div className="w-full flex flex-row justify-center items-center gap-2">
          <button
            className={getButtonClass("en-US")}
            onClick={() => handleLanguageChange("en-US")}
            onFocus={() => setFocusedLanguage("en-US")}
          >
            en-US
          </button>
          <button
            className={getButtonClass("fa-IR")}
            onClick={() => handleLanguageChange("fa-IR")}
            onFocus={() => setFocusedLanguage("fa-IR")}
          >
            fa-IR
          </button>
        </div>
        <div className="w-full flex flex-row justify-center items-center gap-2">
          <button
            className={getButtonClass("tr-TR")}
            onClick={() => handleLanguageChange("tr-TR")}
            onFocus={() => setFocusedLanguage("tr-TR")}
          >
            tr-TR
          </button>
          <button
            className={getButtonClass("ar-SA")}
            onClick={() => handleLanguageChange("ar-SA")}
            onFocus={() => setFocusedLanguage("ar-SA")}
          >
            ar-SA
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChoiceLngModal;
