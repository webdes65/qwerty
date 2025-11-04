import { useState } from "react";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CityCard from "@components/module/card/CityCard";
import AddCityModal from "@components/module/modal/AddCityModal";
import CityIndexHandler from "@module/container/main/city/CityIndexHandler.js";
import SkeletonList from "@module/SkeletonList.jsx";

const Cities = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cities, isLoading, error } = CityIndexHandler();

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Quicksand pr-2 bg-white text-dark-100 dark:bg-dark-100 dark:text-white">
      <div className="w-full h-auto flex flex-row justify-end items-center pt-1">
        <Button
          type="primary"
          className="font-Quicksand font-bold !bg-blue-200 dark:!bg-blue-300 !py-5 !px-6 !shadow !text-[#3b82f6] dark:!text-blue-600 !text-[0.90rem] !border-[2.5px] !border-blue-500 dark:!border-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleOutlined style={{ fontSize: "20px", color: "#3b82f6 " }} />
          Add City
        </Button>
      </div>
      <ul className="w-full flex flex-row justify-start items-center flex-wrap">
        {isLoading ? (
          <SkeletonList count={6} />
        ) : (
          cities.map((city) => <CityCard key={city.uuid} city={city} />)
        )}
      </ul>

      {isModalOpen && (
        <AddCityModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default Cities;
