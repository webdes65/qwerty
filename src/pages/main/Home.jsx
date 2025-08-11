import { useNavigate } from "react-router-dom";
import { itemsHome } from "@data/Items.js";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{ direction: "rtl" }}
      className="w-full h-full bg-[#F3F4F6] font-Quicksand"
    >
      <div className="w-full h-full flex flex-row justify-center items-center flex-wrap">
        {itemsHome.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(item.url);
            }}
            className={`${
              index % 2 === 0
                ? "w-[18rem] max-xl:w-[14rem] max-lg:w-[10rem] max-md:w-1/2"
                : "w-[12rem] max-xl:w-[8rem] max-lg:w-[6rem] max-md:w-1/2"
            } h-[16rem] flex flex-col justify-center items-center p-1`}
          >
            <div
              className={`h-full w-full flex flex-col justify-center items-center gap-3 bg-white shadow rounded-[10px] cursor-pointer`}
            >
              <div className="w-full h-1/2 flex flex-row justify-center items-center">
                <img
                  src={item.icon}
                  alt="GIF"
                  className="w-24 h-24 max-lg:w-20 max-lg:h-20"
                />
              </div>
              <p className="font-bold text-black text-[1rem] max-lg:text-[0.80rem] uppercase w-full text-center max-md:text-sm">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
