import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createEngineerReport,
  getEngineerReport,
  openEngineerReport,
  deleteEngineerReport
} from "@/api/engineer/engineer";
import { set } from "zod";

export const useCreateEngineerReport = () => {
  return useMutation({
    mutationFn: createEngineerReport,
    onSuccess: () => {
      toast.success("Engineer Report created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: () => {
      toast.error("Error creating engineer report");
    },
  });
};

export const useGetEngineerReport = ({
  user,
  user_role,
  pump_detail,
}: {
  user: string;
  user_role: string;
  pump_detail: string;
}) => {
  return useQuery({
    queryKey: ["engineer", "report", user, user_role, pump_detail],
    queryFn: () => getEngineerReport({ user, user_role, pump_detail}),
    enabled: !!user && !!user_role && !!pump_detail
  })
};

export const useOpenEngineerReport = (id: string) => {
  const {data,error} = useQuery({
    queryKey: ["engineer", "report", "open", id],
    queryFn: () => openEngineerReport(id),
    enabled: !!id
  })

  if (error) {
    toast.error("Error opening engineer report");
  }

  if (data) {
    toast.success("Engineer Report opened successfully");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  return {data,error}
};

export const useDeleteEngineerReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id : string) => deleteEngineerReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["engineer", "report"]});
      toast.success("Report deleted successfully")
    },
    onError: () => {
      toast.error("Error deleting engineer report");
    },
  })
}