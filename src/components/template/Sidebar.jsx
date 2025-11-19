import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbDoorExit } from "react-icons/tb";
import { AiOutlineDesktop, AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { Button, Dropdown, Space } from "antd";
import LogoutModal from "@module/modal/LogoutModal.jsx";
import MenuHelperHandlers from "@module/container/main/menu/MenuHelperHandlers.jsx";
import UseDarkModeStore from "@store/UseDarkMode.js";
import "@styles/sidebarStyles.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const {
    darkMode,
    useSystemTheme: useSystemThemeMode,
    setDarkMode,
    enableSystemTheme,
    disableSystemTheme,
  } = UseDarkModeStore();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const {
    isActive,
    themeMenuItems,
    handleNavigation,
    handleLogout,
    visibleMenuItems,
  } = MenuHelperHandlers({
    setDarkMode,
    enableSystemTheme,
    disableSystemTheme,
    useSystemThemeMode,
  });

  return (
    <aside className="max-w-64 h-full flex flex-col justify-between items-start p-2 bg-white text-dark-100 dark:bg-dark-100 dark:text-white border-r border-r-gray200 dark:border-gray-600 font-Quicksand font-medium max-lg:hidden !overflow-auto">
      <ul className="w-full h-full flex flex-col justify-start items-start gap-2 font-medium text-[0.85rem]">
        <div
          className="flex flex-row justify-start items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-12 h-12 max-md:hidden">
            <img
              alt="logo"
              src="/assets/images/logo.webp"
              className="w-full h-full"
            />
          </div>
          <h1
            className="font-bold text-[1.75rem] p-2 max-md:hidden text-transparent bg-clip-text"
            style={{
              backgroundImage: darkMode
                ? "linear-gradient(to right, #9897c6, #94d2e0"
                : "linear-gradient(to right, #6D6CAA, #6EC5D6)",
            }}
          >
            MCP
          </h1>
        </div>

        {visibleMenuItems.map((item) => {
          const Icon = item.sidebarIcon || item.icon;
          const label = item.sidebarLabel || item.label;
          const active = isActive(item);

          return (
            <li
              key={item.id}
              className={`${item.sidebarClassName} sidebarItemsStyles ${
                active ? "bg-tealBlue text-white" : ""
              }`}
              onClick={() => handleNavigation(item.route)}
            >
              <Icon className="text-[1.5rem]" />
              {label}
            </li>
          );
        })}

        <li className="flex flex-col items-center justify-end gap-1 w-full h-full mb-4">
          <div className="flex items-center gap-1 flex-row-reverse">
            <Dropdown
              menu={{ items: themeMenuItems }}
              trigger={["click"]}
              className="mb-2"
            >
              <Button type="text" className="flex items-center gap-2">
                <Space>
                  {useSystemThemeMode ? (
                    <AiOutlineDesktop />
                  ) : darkMode ? (
                    <AiOutlineMoon />
                  ) : (
                    <AiOutlineSun />
                  )}
                </Space>
              </Button>
            </Dropdown>
            <p className="text-dark-100 dark:text-white mb-2.5">
              {useSystemThemeMode
                ? "System mode"
                : darkMode
                  ? "Dark mode"
                  : "Light mode"}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="flex flex-row justify-center items-center gap-2 text-red-500 font-bold"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <TbDoorExit className="text-red-500 text-[25px]" />
              Logout
            </button>

            <LogoutModal
              title="Do you want to log out of your account?"
              isOpenModal={isLogoutModalOpen}
              setIsOpenModal={setIsLogoutModalOpen}
              onLogout={handleLogout}
            />
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
