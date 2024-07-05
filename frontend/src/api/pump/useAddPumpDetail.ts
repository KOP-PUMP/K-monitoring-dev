import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PumpDetailOut, PumpDetailIn } from "@/types/pumps";
import { ApiResponse } from "@/types/response";
import { addPumpDetail } from "./pump";
import { toast } from "react-toastify";

export const useAddPumpDetail = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<PumpDetailOut>, unknown, PumpDetailIn>({
    mutationFn: addPumpDetail,
    onMutate: async (newPumpDetail: PumpDetailIn) => {
      await queryClient.cancelQueries({ queryKey: ["pumpDetails"] });
      const previousPumpDetails = queryClient.getQueryData<ApiResponse<PumpDetailOut[]>>(["pumpDetails"]);

      if (previousPumpDetails) {
        queryClient.setQueryData<ApiResponse<PumpDetailOut[]>>(["pumpDetails"], {
          ...previousPumpDetails,
          data: [...previousPumpDetails.data, { pump_id: Date.now(), ...newPumpDetail }],
        });
      }

      return { previousPumpDetails };
    },
    // onError: (err, newPumpDetail, context: { previousPumpDetails?: any }) => {
    //   if (context?.previousPumpDetails) {
    //     queryClient.setQueryData(["pumpDetails"], context.previousPumpDetails);
    //   }
    //   toast.error("Error adding pump detail");
    // },
    onError: () => {
      toast.error("Error adding pump detail");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pumpDetails"] });
      toast.success("Pump detail added successfully");
    },
  });
};
