import {
  useQuery,
  useMutation,
  useQueryClient,
  Mutation,
} from "@tanstack/react-query";
import { getProvince } from "@/api/dropdown";
import toast from "react-hot-toast";

export const useGetAllProvince = () => {
  return useQuery({
    queryKey: ["province"],
    queryFn: getProvince,
  });
};
