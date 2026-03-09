import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCustomersDetail } from "@/api/user/customers";

export const useGetAllCustomersDetail = () => {
  return useQuery<any[]>({
    queryKey: ["customers", "customer_list"],
    queryFn: getAllCustomersDetail,
  });
}