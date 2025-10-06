import { useState } from "react";
import { useQuery } from "react-query";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import AddUserModal from "@components/module/modal/AddUserModal";
import ARProjectSubprojectSkeleton from "@components/module/card/ARProjectSubprojectSkeleton";
import UserCard from "@components/module/card/UserCard";
import { request } from "@services/apiService.js";

const Employees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery(["fetchUsers"], () =>
    request({
      method: "GET",
      url: "/api/users",
    }),
  );

  const handleModalClose = () => {
    setIsModalOpen(false);
    refetch();
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  const users = data?.data || [];

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Quicksand pr-2 bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
      <div className="w-full h-auto flex flex-row justify-end items-center pt-1">
        <Button
          type="primary"
          className="font-Quicksand font-bold !bg-blue-200 dark:!bg-blue-300 !py-5 !px-6 !shadow !text-[#3b82f6] dark:!text-blue-600 !text-[0.90rem] !border-[2.5px] !border-blue-500 dark:!border-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleOutlined style={{ fontSize: "20px", color: "#3b82f6 " }} />
          Add User
        </Button>
      </div>
      <ul className="w-full flex flex-row justify-start items-center flex-wrap">
        {isLoading ? (
          <>
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
          </>
        ) : (
          users.map((user) => <UserCard key={user.uuid} data={user} />)
        )}
      </ul>
      {isModalOpen && (
        <AddUserModal
          isModalOpen={isModalOpen}
          setIsModalOpen={handleModalClose}
        />
      )}
    </div>
  );
};

export default Employees;
