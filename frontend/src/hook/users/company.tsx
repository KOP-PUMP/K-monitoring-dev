import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompaniesResponse,ContactPersonResponse } from "@/types/users/company";
import { getAllCompaniesDetail } from "@/api/user/company";
import toast from "react-hot-toast";
import { get } from "http";

export const useGetAllCompaniesData = () => {
  return useQuery<CompaniesResponse[]>({
    queryKey: ["pump", "unit_lov"],
    queryFn: getAllCompaniesDetail,
  });
};