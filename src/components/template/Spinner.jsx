const Spinner = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <img
        src="https://s8.uupload.ir/files/metariom_k1n.png"
        alt="MMCP"
        className="w-28"
      />
      <img
        src="https://s8.uupload.ir/files/ellipsis_1x-1.5s-200px-200px_yp0w.gif"
        alt="Loading"
        style={{ width: "60px" }}
      />
    </div>
  );
};

export default Spinner;
