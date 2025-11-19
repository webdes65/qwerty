import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function RegisterReportsHandlers({
  registerId,
  setCurrentPage,
  startDate,
  endDate,
  currentPage,
  setIsChartModalOpen,
}) {
  const [allPages, setAllPages] = useState("");
  const [listReports, setListReports] = useState("");
  const [submitPending, setSubmitPending] = useState(false);
  const [dataChart, setDataChart] = useState(false);
  const [loadingChartData, setLoadingChartData] = useState(false);

  const mutation = useMutation(
    (data) =>
      request({
        method: "POST",
        url: `/api/registers/${registerId}/logs`,
        data,
      }),
    {
      onSuccess: (data) => {
        setCurrentPage(data.data.current_page);
        setAllPages(data.data.last_page);
        setListReports(data.data.data);
      },
      onError: (error) => {
        logger.error(error);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    },
  );

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      return;
    }
    setSubmitPending(true);

    const values = {
      page: currentPage,
      from: startDate ? startDate.format("YYYY-MM-DD") : "",
      to: endDate ? endDate.format("YYYY-MM-DD") : "",
    };

    mutation.mutate(values);
  };

  const fetchChartData = useMutation(
    (data) =>
      request({
        method: "POST",
        url: `/api/registers/${registerId}/logs`,
        data,
      }),
    {
      onSuccess: (data) => {
        setDataChart(data.data.data);
        setIsChartModalOpen(true);
      },
      onError: (error) => {
        logger.error(error);
      },
      onSettled: () => {
        setLoadingChartData(false);
      },
    },
  );

  const handleFetchChartData = () => {
    const values = {
      pagination: false,
      from: startDate ? startDate.format("YYYY-MM-DD") : "",
      to: endDate ? endDate.format("YYYY-MM-DD") : "",
    };

    setLoadingChartData(true);
    fetchChartData.mutate(values);
  };

  useEffect(() => {
    handleGenerateReport();
  }, [currentPage]);

  return {
    allPages,
    listReports,
    dataChart,
    loadingChartData,
    submitPending,
    handleGenerateReport,
    handleFetchChartData,
  };
}
