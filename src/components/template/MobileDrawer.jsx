import { useState } from "react";
import { TbDoorExit } from "react-icons/tb";
import { AiOutlineDesktop, AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { Button, Drawer, Dropdown, Space } from "antd";
import LogoutModal from "@module/modal/LogoutModal.jsx";
import MenuHelperHandlers from "@module/container/main/menu/MenuHelperHandlers.jsx";
import UseDarkModeStore from "@store/UseDarkMode.js";
import "@styles/sidebarStyles.css";

const MobileDrawer = ({ open, onClose }) => {
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
    onClose,
    setDarkMode,
    enableSystemTheme,
    disableSystemTheme,
    useSystemThemeMode,
  });

  return (
    <>
      <Drawer
        className="font-Poppins text-[1rem] font-bold bg-white text-dark-100 dark:bg-dark-100 dark:text-white border-r border-r-gray200 dark:border-gray-600"
        title="BMS"
        placement="left"
        closable={true}
        onClose={onClose}
        open={open}
        key="left"
      >
        <div className="h-full flex flex-col justify-between items-start !overflow-auto">
          <div className="w-full flex flex-col justify-start items-start gap-1">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <p
                  key={item.id}
                  className={`${item.mobileClassName} mobileDrawerStyles ${
                    active ? "bg-tealBlue text-white" : ""
                  }`}
                  onClick={() => handleNavigation(item.route)}
                >
                  <Icon className="text-[1.5rem]" />
                  {item.label}
                </p>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-center gap-1 w-full">
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
            <button
              className="flex flex-row justify-center items-center gap-2 text-red-500 font-bold"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <TbDoorExit className="text-red-500 text-[25px]" />
              Logout
            </button>
          </div>
        </div>
      </Drawer>

      <LogoutModal
        title="Do you want to log out of your account?"
        isOpenModal={isLogoutModalOpen}
        setIsOpenModal={setIsLogoutModalOpen}
        onLogout={handleLogout}
      />
    </>
  );
};

export default MobileDrawer;
