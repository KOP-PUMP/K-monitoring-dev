import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CompaniesResponse,
  ContactPersonResponse,
} from "@/types/users/company";
import {
  getAllCompaniesDetail,
  deleteCompany,
  getPECCompanyDetail,
  getPECContactDetail,
  createCompany,
  updateCompany,
} from "@/api/user/company";
import toast from "react-hot-toast";
import { get } from "http";

export const useGetAllCompaniesData = () => {
  return useQuery<CompaniesResponse[]>({
    queryKey: ["companies"],
    queryFn: getAllCompaniesDetail,
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ code }: { code: string }) => deleteCompany(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success("Company deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting company");
    },
  });
};

export const useCreateCompany = () => {
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      toast.success("Company created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: () => {
      toast.error("Error creating company");
    },
  });
};

export const useUpdateCompany = () => {
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: any }) => {
      if (!code) {
        return Promise.reject(new Error("Customer code is required"));
      }
      return updateCompany({ code, data });
    },
    onSuccess: () => {
      toast.success("Company detail updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error update company detail");
      console.error("Update Error", error);
    },
  });
};

export const useGetPECContactDetail = (code: string) => {
  return useQuery({
    queryKey: ["contact", code],
    queryFn: () => getPECContactDetail(code),
  });
};

export const useGetPECCompanyDetail = (code: string) => {
  return useQuery({
    queryKey: ["company", code],
    queryFn: () => getPECCompanyDetail(code),
  });
};
