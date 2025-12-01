import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import generateMindFile from "@utils/generateMindFile.js";
import logger from "@utils/logger.js";

export default function AddARHandler({ setIsModalOpenAR, setFileList }) {
  const queryClient = useQueryClient();

  const [progress, setProgress] = useState(0);
  const [submitPending, setSubmitPending] = useState(false);

  const mutation = useMutation(
    (formData) => {
      return request({
        method: "POST",
        url: "/api/augmented-realities",
        data: formData,
        contentType: "multipart/form-data",
      });
    },
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        queryClient.invalidateQueries("ARList");
        setIsModalOpenAR(false);
        setProgress(0);
        setFileList([]);
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    },
  );

  const handlerSubmit = async (values) => {
    try {
      setSubmitPending(true);

      const mindFile = await generateMindFile(values.files, (progress) => {
        setProgress(progress);
      });

      if (mindFile) {
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("description", values.description);

        formData.append("mindFile", mindFile, "mindfile.mind");

        values.files.forEach((file) => {
          const actualFile = file.originFileObj || file;
          formData.append("files[]", actualFile, actualFile.name);
        });

        mutation.mutate(formData);
      } else {
        toast.error("Failed to generate mind file.");
      }
    } catch (error) {
      logger.log(error);
      toast.error("An error occurred while processing files.");
    } finally {
      setSubmitPending(false);
    }
  };

  return { progress, submitPending, handlerSubmit };
}
