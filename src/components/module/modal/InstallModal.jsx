import { CURRENT_VERSION } from "@version";
import "@styles/installModal.css";

const InstallModal = () => {
  return (
    <>
      <div id="modalOverlay"></div>
      <div
        id="installModal"
        className="w-1/2 h-auto flex flex-col justify-center items-center rounded-lg p-4 shadow-xl bg-white text-dark-100 dark:bg-dark-100 dark:text-white max-md:w-8/12 max-sm:w-11/12 font-outfit"
      >
        <p className="font-normal">
          Do you want to install this app {CURRENT_VERSION} ?
        </p>
        <div className="w-full h-auto flex flex-row justify-start items-center gap-1 pt-2 font-light text-white">
          <button
            id="installBtn"
            className="btn w-auto  bg-blue-500 dark:bg-blue-400 rounded-md px-4 py-2 text-base shadow-lg"
          >
            Install
          </button>
          <button
            id="closeModal"
            className="btn w-auto  bg-red-500 dark:bg-red-400 rounded-md px-4 py-2 text-base shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default InstallModal;
