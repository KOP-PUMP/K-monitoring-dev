import {
  useQuery,
} from "@tanstack/react-query";
import { getProvince } from "@/api/dropdown";

export const useGetAllProvince = () => {
  return useQuery({
    queryKey: ["province"],
    queryFn: getProvince,
  });
};
