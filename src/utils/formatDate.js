import { format } from "date-fns";
import logger from "@utils/logger.js";

/**
 * @param {string} dateString
 * @param {string} defaultValue
 * @returns {string}
 */
export const formatDate = (dateString, defaultValue = "N/A") => {
  if (!dateString) return defaultValue;

  try {
    return format(new Date(dateString), "yyyy/MM/dd HH:mm:ss");
  } catch (error) {
    logger.error("Error formatting date:", error);
    return defaultValue;
  }
};

/**
 * @param {Object} data
 * @returns {Object}
 */
export const formatTimestamps = (data) => ({
  formattedCreatedAt: formatDate(data?.created_at),
  formattedUpdatedAt: formatDate(data?.updated_at),
});
