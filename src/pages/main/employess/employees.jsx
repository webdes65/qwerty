import { useQuery } from "react-query";
import { request } from "../../../services/apiService";
import ARProjectSubprojectSkeleton from "../../../components/module/card/ARProjectSubprojectSkeleton";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import UserCard from "../../../components/module/card/UserCard";
import { useState } from "react";
import AddUserModal from "../../../components/module/modal/AddUserModal";

const Employees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery(["fetchUsers"], () =>
    request({
      method: "GET",
      url: "/api/users",
    })
  );

  if (error) {
    return <div>{error.message}</div>;
  }

  const users = data?.data || [];

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Quicksand pr-2">
      <div className="w-full h-auto flex flex-row justify-end items-center pt-1">
        <Button
          type="primary"
          className="font-Quicksand font-bold !bg-blue-200 !py-5 !px-6 !shadow !text-[#3b82f6] !text-[0.90rem] !border-[2.5px] !border-blue-500"
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
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default Employees;
