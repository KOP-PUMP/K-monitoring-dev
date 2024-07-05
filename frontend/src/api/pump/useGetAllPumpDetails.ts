import { useQuery } from "@tanstack/react-query";
import { ApiResponse, FetchDataResponse, PumpDetailOut } from "@/types";
import { getAllPumpDetails } from "./pump";

export const useGetAllPumpDetails = () => {
  return useQuery<ApiResponse<FetchDataResponse<PumpDetailOut[]>>>({
    queryKey: ["pumpDetails"],
    queryFn: getAllPumpDetails,
  });
};
