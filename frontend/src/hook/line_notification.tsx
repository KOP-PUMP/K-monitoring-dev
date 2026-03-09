import { sendLineNotification } from "../api/line_notification";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useSendLineNotification = () => {
  return useMutation({
    mutationFn: sendLineNotification,
    onSuccess: () => {
      toast.success("Pump Detail created successfully");
      setTimeout(() => {
        for (let n = 1; n <= 5; n++) {
          window.localStorage.removeItem(`formData${n}`);
        }
        window.location.reload();
      }, 2000);
    },
    onError: () => {
      toast.error("Error creating pump detail");
    },
  });
};
