import { useLocation, useNavigate } from "react-router-dom";

const MobileMenu = () =>
  // {
  //   isModalOpen,
  //   setIsModalOpen,
  //   setIsFirstTime,
  //   isListening,
  //   setIsListening,
  //   selectedLanguage,
  //   setSelectedLanguage,
  // }
  {
    const navigate = useNavigate();
    const location = useLocation();

    // const toggleListening = () => {
    //   if (isListening) {
    //     annyang.abort();
    //   } else {
    //     annyang.setLanguage(selectedLanguage);
    //     annyang.start();
    //   }
    //   setIsListening(!isListening);
    // };

    return (
      <div className="h-[4rem] hidden flex-row justify-between items-center bg-[#fff] shadow rounded-xl font-Quicksand relative max-md:flex">
        <div className="w-full flex flex-row justify-around items-center">
          <div className="w-1/2 h-full flex flex-row justify-center items-center">
            <button
              onClick={() => navigate("/")}
              className={`w-14 h-14 flex flex-row justify-center items-center text-black-500 rounded-full ${
                location.pathname === "/" ? "bg-gray-200" : " "
              }`}
            >
              <img
                src="/assets/icons/sidebarIcons/home.png"
                alt="icon"
                className="w-8 h-8"
              />
            </button>
          </div>
          <div className="w-1/2 h-full flex flex-row justify-center items-center">
            <button
              onClick={() => navigate("/createform")}
              className={`w-14 h-14 flex flex-row justify-center items-center text-black-500 rounded-full ${
                location.pathname === "/createform" ? "bg-gray-200" : " "
              }`}
            >
              <img
                src="/assets/icons/sidebarIcons/pencil.png"
                alt="icon"
                className="w-8 h-8"
              />
            </button>
          </div>
        </div>
        {/* <div className="w-[4.5rem] h-[4.5rem] flex flex-row justify-center items-center">
          <input type="checkbox" id="checkbox" onChange={toggleListening} />
          <label className="switch" htmlFor="checkbox">
            <div className="mic-on">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-mic-fill"
                viewBox="0 0 16 16"
              >
                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"></path>
                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"></path>
              </svg>
            </div>
            <div className="mic-off">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-mic-mute-fill"
                viewBox="0 0 16 16"
              >
                <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3z"></path>
                <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"></path>
              </svg>
            </div>
          </label>
        </div> */}
        <div className="w-full flex flex-row justify-around items-center">
          <div className="w-1/2 h-full flex flex-row justify-center items-center">
            <button
              onClick={() => navigate("/devices")}
              className={`w-14 h-14 flex flex-row justify-center items-center text-black-500 rounded-full ${
                location.pathname === "/devices" ? "bg-gray-200" : " "
              }`}
            >
              <img
                src="/assets/icons/sidebarIcons/computer.png"
                alt="icon"
                className="w-8 h-8"
              />
            </button>
          </div>
          <div className="w-1/2 h-full flex flex-row justify-center items-center">
            <button
              onClick={() => navigate("/graphs")}
              className={`w-14 h-14 flex flex-row justify-center items-center text-black-500 rounded-full ${
                location.pathname === "/graphs" ? "bg-gray-200" : " "
              }`}
            >
              <img
                src="/assets/icons/sidebarIcons/growth.png"
                alt="icon"
                className="w-8 h-8"
              />
            </button>
          </div>
        </div>
        {/* <ChoiceLngModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setIsFirstTime={setIsFirstTime}
          setSelectedLanguage={setSelectedLanguage}
          selectedLanguage={selectedLanguage}
        /> */}
      </div>
    );
  };

export default MobileMenu;
