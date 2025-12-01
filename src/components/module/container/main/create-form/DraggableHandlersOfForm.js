import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "universal-cookie";
import logger from "@utils/logger.js";
import { generateCypherKey } from "@utils/generateCypherKey.js";

export default function DraggableHandlersOfForm({
  item,
  showModalFormDisplay,
  setShowModalFormDisplay,
}) {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("bms_access_token");

  const [sendRequest, setSendRequest] = useState(false);

  const handleClick = async () => {
    const storedRegisters = JSON.parse(localStorage.getItem("registers"));

    if (item.path !== "") {
      window.open(item.path, "_blank");
    } else if (item.idForm !== "") {
      if (item.typeDisplay === "form") {
        navigate("/createform", { state: { id: item.idForm } });
      } else {
        if (!showModalFormDisplay) {
          setShowModalFormDisplay(true);
        }
      }
    } else if (item.infoReqBtn !== null) {
      let updatedValue = item.infoReqBtn.value;

      if (item.infoReqBtn.singleIncrease === true) {
        if (Array.isArray(storedRegisters)) {
          const foundItem = storedRegisters.find(
            (item) => item.id === item.infoReqBtn.register_id,
          );

          if (foundItem) {
            let currentValue = Number(foundItem.value);

            if (isNaN(currentValue)) {
              logger.error("Invalid value for 'value', defaulting to 0.");
              currentValue = 0;
            }

            updatedValue = currentValue + 1;
            foundItem.value = updatedValue;
          } else {
            logger.log("No matching item found.");
          }
        } else {
          logger.log("temps is not a valid array.");
        }
      }

      if (item.infoReqBtn.singleReduction === true) {
        const foundItem = storedRegisters.find(
          (item) => item.id === item.infoReqBtn.register_id,
        );

        if (foundItem) {
          let currentValue = Number(foundItem.value);

          if (isNaN(currentValue)) {
            logger.error("Invalid value for 'value', defaulting to 0.");
            currentValue = 0;
          }

          updatedValue = currentValue - 1;
          foundItem.value = updatedValue;
        } else {
          logger.log("No matching item found.");
        }
      }

      const data = {
        device_uuid: item.infoReqBtn.device_uuid,
        title: item.infoReqBtn.title,
        value: isNaN(Number(updatedValue)) ? 0 : Number(updatedValue),
      };

      try {
        const cypherKey = await generateCypherKey();

        const response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/api/registers/${item.infoReqBtn.register_id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              cypherKey,
            },
          },
        );

        if (response.status === 200) {
          toast.success(response.data.message);
        }
      } catch (error) {
        if (error.status === 422) {
          toast.error(error.response.data.data);
        } else {
          logger.error(error);
        }
      }
    }
  };

  useEffect(() => {
    const updateRegister = async () => {
      if (
        item.indexType !== "text input" ||
        item.infoReqBtn.device_uuid === null ||
        !sendRequest
      )
        return;

      const data = {
        device_uuid: item.infoReqBtn.device_uuid,
        title: item.infoReqBtn.title,
        value: item.title,
      };

      try {
        const cypherKey = await generateCypherKey();

        const response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/api/registers/${item.infoReqBtn.register_id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              cypherKey,
            },
          },
        );

        if (response.status === 200) {
          toast.success(response.data.message);

          const registers = JSON.parse(localStorage.getItem("registers")) || [];

          const updatedRegisters = registers.map((item) =>
            item.id === item.id
              ? { ...item, title: response.data.data.value }
              : item,
          );

          localStorage.setItem("registers", JSON.stringify(updatedRegisters));
        }
      } catch (error) {
        if (error.status === 422) {
          toast.error(error.response.data.data);
        }
      } finally {
        setSendRequest(false);
      }
    };

    updateRegister();
  }, [item.indexType, item.title, item.infoReqBtn, sendRequest]);

  return { setSendRequest, handleClick };
}
