import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { request } from "@services/apiService.js";
import logger from "@utils/logger.js";

export default function AddUserHandlers({ setIsModalOpen, setSubmitPending }) {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data) => request({ method: "POST", url: "/api/users", data }),
    {
      onSuccess: (data) => {
        toast.success(data.data.message);
        logger.log("data", data);

        queryClient.invalidateQueries("fetchUsers");

        setIsModalOpen(false);
      },
      onError: (error) => {
        const errors = error.response?.data?.errors;
        if (errors) {
          Object.values(errors).forEach((messages) => {
            messages.forEach((msg) => {
              toast.error(msg);
            });
          });
        } else {
          toast.error("An error occurred.");
        }
      },
      onSettled: () => {
        setSubmitPending(false);
      },
    },
  );

  const { data: dataLngs } = useQuery(["fetchLanguages"], () =>
    request({
      method: "GET",
      url: "/api/users/languages",
    }),
  );

  const optionsLanguages = dataLngs?.data
    ? Object.entries(dataLngs.data).map(([key, value]) => ({
        value: key,
        label: value,
      }))
    : [];

  const { data: dataTimezones } = useQuery(["fetchTimezones"], () =>
    request({
      method: "GET",
      url: "/api/users/timezones",
    }),
  );

  const timezonesOptions =
    dataTimezones?.data?.map((index) => ({
      value: index,
      label: index,
    })) || [];

  const { data: dataRole } = useQuery(["fetchRoles"], () =>
    request({
      method: "GET",
      url: "/api/roles",
    }),
  );

  const roleOptions =
    dataRole?.data?.map((index) => ({
      value: index.uuid,
      label: index.name,
    })) || [];

  const validateWithToast = (values) => {
    const errors = [];

    if (!values.name) {
      errors.push("Username is required");
    } else if (!/^(?![_.])([a-zA-Z0-9._]{1,30})(?<![_.])$/.test(values.name)) {
      errors.push(
        "Invalid username. Only letters, numbers, dots, and underscores are allowed.",
      );
    }

    if (!values.password) {
      errors.push("Password is required");
    } else if (values.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (!values.password_confirmation) {
      errors.push("Password confirmation is required");
    } else if (values.password !== values.password_confirmation) {
      errors.push("Passwords do not match");
    }

    if (!values.email) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.push("Email is invalid");
    }

    if (!values.timezone) errors.push("Timezone is required");
    if (!values.calendar) errors.push("Calendar is required");

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    return true;
  };

  const handlerSubmit = async (values, { resetForm }) => {
    if (!validateWithToast(values)) return;

    setSubmitPending(true);
    try {
      await mutation.mutateAsync(values);
      resetForm();
    } catch (error) {
      logger.error(error);
    }
  };

  return { handlerSubmit, optionsLanguages, timezonesOptions, roleOptions };
}
