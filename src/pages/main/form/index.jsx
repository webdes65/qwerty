import { useQuery } from "react-query";
import { IoLogoDropbox } from "react-icons/io5";
import ARProjectSubprojectSkeleton from "@components/module/card/ARProjectSubprojectSkeleton";
import FormCard from "@components/module/card/FormCard";
import { request } from "@services/apiService.js";

const Forms = () => {
  const { data, isLoading } = useQuery(["GetForms"], () =>
    request({
      method: "GET",
      url: "/api/forms",
    }),
  );

  const forms = data?.data || [];

  return (
    <div className="w-full h-[90vh] flex flex-col justify-start items-start gap-2 overflow-auto font-Poppins pt-2">
      <ul className="w-full h-auto flex flex-row justify-start items-start flex-wrap">
        {isLoading ? (
          <>
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
            <ARProjectSubprojectSkeleton />
          </>
        ) : forms.length === 0 ? (
          <div className="w-full h-full flex flex-col justify-center items-center font-Quicksand uppercase font-bold bg-gray-200 rounded-md shadow">
            <IoLogoDropbox className="text-[5rem] text-gray-400" />
            <p className="text-gray-500 cursor-default">No Data</p>
          </div>
        ) : (
          forms.map((form, index) => <FormCard key={index} form={form} />)
        )}
      </ul>
    </div>
  );
};

export default Forms;
