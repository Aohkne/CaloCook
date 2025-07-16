import { notification } from "antd";

export function handleApiError(error) {
  const errData = error?.response.data || error;
  notification.error({
    message: "Error",
    description:
      errData?.message ||
      errData?.error ||
      "An unexpected error occurred. Please try again.",
    duration: 4,
  });
}
