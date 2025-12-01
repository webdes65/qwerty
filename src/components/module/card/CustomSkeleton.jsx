const CustomSkeleton = () => {
  return (
    <div className="w-1/2 h-auto p-1 font-bold cursor-pointer animate-pulse max-lg:w-full">
      <div className="h-full w-full flex flex-col gap-2 rounded-md bg-gray-200 shadow p-3 hover:shadow-xl">
        <div className="w-1/2 h-8 rounded-md bg-gray-300"></div>
        <div className="flex flex-col justify-center items-start gap-2">
          <div className="w-1/2 h-4 rounded-md bg-gray-300"></div>
          <div className="w-1/2 h-4 rounded-md bg-gray-300"></div>
        </div>
        <div className="w-full h-8 rounded-md bg-gray-300"></div>
      </div>
    </div>
  );
};

export default CustomSkeleton;
