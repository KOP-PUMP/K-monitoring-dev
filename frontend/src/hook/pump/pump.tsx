import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUnitLOV,
  getLOVById,
  createLOV,
  updateLOV,
  deleteLOV,
} from "@/api/pump/pump";
import { LOVOut } from "@/types";
import toast from "react-hot-toast";

export const useGetAllUnitLOVData = () => {
  return useQuery<LOVOut[]>({
    queryKey: ["pump", "unit_lov"],
    queryFn: getAllUnitLOV,
  });
};

export const useGetLOVById = (id: string) => {
  return useQuery<LOVOut>({
    queryKey: ["pump", "lov", id],
    queryFn: () => getLOVById(id),
  });
};

export const useDeleteLOVById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLOV(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pump", "unit_lov"] });
      toast.success("LOV deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting LOV");
    },
  });
};

export const useCreateLOV = () => {
  return useMutation({
    mutationFn: createLOV,
    onSuccess: () => {
      toast.success("LOV created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: () => {
      toast.error("Error creating LOV");
    },
  });
};

export const useUpdateLOV = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateLOV({ id, data }),
  });
};
