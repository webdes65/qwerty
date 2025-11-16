import {useEffect} from "react";
import {useQuery} from "react-query";
import {request} from "@services/apiService.js";

export default function ButtonSectionHandler({setOptionsForm}) {

    const { data: dataForms } = useQuery(["GetFormData"], () =>
        request({
            method: "GET",
            url: "/api/forms",
        }),
    );

    useEffect(() => {
        if (dataForms) {
            const ids = dataForms.data.map((item) => ({
                label: item.name,
                value: item.uuid,
            }));
            setOptionsForm(ids);
        }
    }, [dataForms]);

    return {dataForms};
}