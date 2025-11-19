import { useLocation, useNavigate } from "react-router-dom";
import UseDarkModeStore from "@store/UseDarkMode.js";
import "@styles/mobileMenuStyles.css";

const MobileMenu = () =>
  {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode } = UseDarkModeStore();

    return (
      <div className="h-[4rem] hidden flex-row justify-between items-center bg-white text-dark-100 dark:bg-dark-100 dark:text-white shadow rounded-xl font-Quicksand relative max-lg:flex">
        <div className="w-full flex flex-row justify-around items-center">
          <div className="parentTagStyle">
            <button
              onClick={() => navigate("/")}
              className={`childTagStyle ${
                location.pathname === "/" ? "bg-gray-200 dark:bg-gray-100" : " "
              }`}
            >
              <img
                src={
                  darkMode
                    ? "/assets/icons/sidebarIcons/dark/home.webp"
                    : "/assets/icons/sidebarIcons/home.webp"
                }
                alt="icon"
                className="w-8 h-8"
              />
            </button>
          </div>
          <div className="parentTagStyle">
            <button
              onClick={() => navigate("/createform")}
              className={`childTagStyle ${
                location.pathname === "/createform"
                  ? "bg-gray-200 dark:bg-gray-100"
                  : " "
              }`}
            >
              <img
                src={
                  darkMode
                    ? "/assets/icons/sidebarIcons/dark/pencil.webp"
                    : "/assets/icons/sidebarIcons/pencil.webp"
                }
                alt="icon"
                className="w-8 h-8"
              />
            </button>
          </div>
        </div>
        <div className="w-full flex flex-row justify-around items-center">
          <div className="parentTagStyle">
            <button
              onClick={() => navigate("/devices")}
              className={`childTagStyle ${
                location.pathname === "/devices"
                  ? "bg-gray-200 dark:bg-gray-100"
                  : " "
              }`}
            >
              <img
                src={
                  darkMode
                    ? "/assets/icons/sidebarIcons/dark/computer.webp"
                    : "/assets/icons/sidebarIcons/computer.webp"
                }
                alt="icon"
                className="w-8 h-8"
              />
            </button>
          </div>
          <div className="parentTagStyle">
            <button
              onClick={() => navigate("/graphs")}
              className={`childTagStyle ${
                location.pathname === "/graphs"
                  ? "bg-gray-200 dark:bg-gray-100"
                  : " "
              }`}
            >
              <img
                src={
                  darkMode
                    ? "/assets/icons/sidebarIcons/dark/growth.webp"
                    : "/assets/icons/sidebarIcons/growth.webp"
                }
                alt="icon"
                className="w-8 h-8"
              />
            </button>
          </div>
        </div>
      </div>
    );
  };

export default MobileMenu;
