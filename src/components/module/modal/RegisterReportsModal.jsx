import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import { DatePicker, Modal, Button, Pagination } from "antd";
import { format } from "date-fns";
import { request } from "@services/apiService.js";
import ChartModal from "@module/modal/ChartModal";
import logger from "@utils/logger.js";

const RegisterReportsModal = ({
  isModalOpen,
  setIsModalOpen,
  deviceName,
  registerId,
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [submitPending, setSubmitPending] = useState(false);
  const [listReports, setListReports] = useState("");
  const [allPages, setAllPages] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const [submitPendingFetchChartData, setSubmitPendingFetchChartData] =
    useState(false);

  const [dataChart, setDataChart] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  const handleFetchChartData = () => {
    const values = {
      pagination: false,
      from: startDate ? startDate.format("YYYY-MM-DD") : "",
      to: endDate ? endDate.format("YYYY-MM-DD") : "",
    };

    setSubmitPendingFetchChartData(true);
    fetchChartData.mutate(values);
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
        setSubmitPendingFetchChartData(false);
      },
    },
  );

  useEffect(() => {
    handleGenerateReport();
  }, [currentPage]);

  return (
    <Modal
      className="font-Quicksand"
      title={`${deviceName} reports `}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
    >
      <div className="flex flex-col gap-4">
        <div className="w-full h-auto flex flex-row justify-between items-center gap-2">
          <DatePicker
            className="w-full h-[2.5rem] border-2 border-gray-200"
            placeholder="Start Date"
            onChange={(date) => setStartDate(date)}
          />
          <DatePicker
            className="w-full h-[2.5rem] border-2 border-gray-200"
            placeholder="End Date"
            onChange={(date) => setEndDate(date)}
          />

          <Button
            className={`w-full h-[2.5rem] font-Quicksand font-medium !p-4 !shadow !text-[0.90rem] !border-[2.5px] ${
              startDate && endDate
                ? "!bg-blue-200 !text-blue-500 !border-blue-500"
                : "!bg-gray-200 !text-gray-400 !border-gray-200"
            }`}
            disabled={!startDate || !endDate}
            type="primary"
            loading={submitPending}
            onClick={handleGenerateReport}
          >
            Generate Report
          </Button>
        </div>
        <div>
          {listReports === "" ? null : listReports.length === 0 ? (
            <p className="font-bold text-red-500 p-2 rounded-md w-full h-auto bg-red-200 border-2 border-red-500">
              There is no record.
            </p>
          ) : (
            <div className="flex flex-col justify-center items-center gap-2">
              <Button
                className="w-full h-[2.5rem] font-Quicksand font-bold !p-4 !shadow !text-[0.90rem] !border-[2.5px] !bg-green-200 !text-green-500 !border-green-500 uppercase"
                type="primary"
                loading={submitPendingFetchChartData}
                onClick={handleFetchChartData}
              >
                Display information in a chart
              </Button>
              <div className="w-full flex flex-row justify-center items-center">
                <p className="w-1/2 flex flex-row justify-center items-center font-bold text-blue-500 uppercase cursor-default">
                  Value
                </p>
                <p className="w-1/2 flex flex-row justify-center items-center font-bold text-blue-500 uppercase cursor-default">
                  Date
                </p>
              </div>
              {listReports.map((report, index) => (
                <div
                  key={index}
                  className={`w-full h-auto flex flex-row justify-center items-center p-2 rounded-md ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <p className="w-1/2 flex flex-row justify-center items-center">
                    {report.value}
                  </p>
                  <p className="w-1/2 flex flex-row justify-center items-center">
                    {report.updated_at
                      ? format(
                          new Date(report.updated_at),
                          "yyyy/MM/dd HH:mm:ss",
                        )
                      : "N/A"}
                  </p>
                </div>
              ))}

              <Pagination
                current={currentPage}
                total={allPages * 10}
                pageSize={10}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>
      {isChartModalOpen && (
        <ChartModal
          isChartModalOpen={isChartModalOpen}
          setIsChartModalOpen={setIsChartModalOpen}
          dataChart={dataChart}
          deviceName={deviceName}
        />
      )}
    </Modal>
  );
};

export default RegisterReportsModal;
