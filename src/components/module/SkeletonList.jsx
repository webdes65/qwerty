import CustomSkeleton from "@module/card/CustomSkeleton.jsx";

const SkeletonList = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CustomSkeleton key={index} />
      ))}
    </>
  );
};

export default SkeletonList;
