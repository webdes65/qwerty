import { request } from "../../../services/apiService";
import { useQuery } from "react-query";
import { Button } from "antd";
import CityCard from "../../../components/module/card/CityCard";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import AddCityModal from "../../../components/module/modal/AddCityModal";
import ARProjectSubprojectSkeleton from "../../../components/module/card/ARProjectSubprojectSkeleton";

const Citys = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery(["fetchCities"], () =>
    request({
      method: "GET",
      url: "/api/cities",
    })
  );

  if (error) {
    return <div>{error.message}</div>;
  }

  const citys = data?.data || [];

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-auto font-Quicksand pr-2">
      <div className="w-full h-auto flex flex-row justify-end items-center pt-1">
        <Button
          type="primary"
          className="font-Quicksand font-bold !bg-blue-200 !py-5 !px-6 !shadow !text-[#3b82f6] !text-[0.90rem] !border-[2.5px] !border-blue-500"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleOutlined style={{ fontSize: "20px", color: "#3b82f6 " }} />
          Add City
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
          citys.map((city) => <CityCard key={city.uuid} city={city} />)
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

export default Citys;
