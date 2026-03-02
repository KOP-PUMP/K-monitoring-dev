import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createEngineerReport,
  getEngineerReport,
  openEngineerReport,
  deleteEngineerReport,
  getEngineerReportCheck,
  createEngineerReportCheck,
  deleteEngineerReportCheck,
  createEngineerReportResultCheck,
  createEngineerReportCalCheck,
  createEngineerReportVibeCheck,
  createEngineerReportVisualCheck,
  getEngineerReportCheckData,
  updateEngineerReportCalCheck,
  updateEngineerReportResultCheck,
  updateEngineerReportVibeCheck,
  updateEngineerReportVisualCheck,
  createNewEngineerReport,
  getEquipmentFromMars,
  getAllMeasureDataFromMars,
  getMeasureDataFromMars,
  getWaveDatafromMars,
  getSpectrumWaveDatafromMars,
} from "@/api/engineer/engineer";
import { set } from "zod";
import { create } from "domain";

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

export const useCreateNewEngineerReport = () => {
  return useMutation({
    mutationFn: createNewEngineerReport,
    onSuccess: () => {
      toast.success("Engineer Report created successfully");
      /* setTimeout(() => {
        window.location.reload();
      }, 2000); */
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
    queryFn: () => getEngineerReport({ user, user_role, pump_detail }),
    enabled: !!user && !!user_role && !!pump_detail,
  });
};

export const useOpenEngineerReport = (id: string) => {
  const { data, error } = useQuery({
    queryKey: ["engineer", "report", "open", id],
    queryFn: () => openEngineerReport(id),
    enabled: !!id,
  });

  if (error) {
    toast.error("Error opening engineer report");
  }

  if (data) {
    toast.success("Engineer Report opened successfully");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  return { data, error };
};

export const useDeleteEngineerReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEngineerReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["engineer", "report"] });
      toast.success("Report deleted successfully");
    },
    onError: (error) => {
      toast.error("Error deleting engineer report");
      console.error("Update Error:", error);
    },
  });
};

export const useCreateEngineerReportCheck = () => {
  return useMutation({
    mutationFn: createEngineerReportCheck,
    onSuccess: () => {
      toast.success("Engineer Report Check created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error creating engineer report check");
      console.error("Update Error:", error);
    },
  });
};

export const useGetEngineerReportCheck = (id: string | null) => {
  return useQuery({
    queryKey: ["engineer", "report", "check", id],
    queryFn: () => getEngineerReportCheck(id),
  });
};

export const useDeleteEngineerReportCheck = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEngineerReportCheck(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["engineer", "report", "check"],
      });
      toast.success("Report deleted successfully");
    },
    onError: (error) => {
      toast.error("Error deleting engineer report");
      console.error("Update Error:", error);
    },
  });
};

export const useCreateEngineerReportCalCheck = () => {
  return useMutation({
    mutationFn: createEngineerReportCalCheck,
    onSuccess: () => {
      toast.success("Engineer Report Cal Check created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error creating engineer report Cal check");
      console.error("Update Error:", error);
    },
  });
};

export const useUpdateEngineerReportCalCheck = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      updateEngineerReportCalCheck(data, id),
    onSuccess: () => {
      toast.success("Engineer Report Cal Check updated successfully");
      /* setTimeout(() => {
        window.location.reload();
      }, 2000); */
    },
    onError: (error) => {
      toast.error("Error updating engineer report Cal check");
      console.error("Update Error:", error);
    },
  });
};

export const useCreateEngineerReportVibeCheck = () => {
  return useMutation({
    mutationFn: createEngineerReportVibeCheck,
    onSuccess: () => {
      toast.success("Engineer Report Vibe Check created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error creating engineer report Vibe check");
      console.error("Update Error:", error);
    },
  });
};

export const useUpdateEngineerReportVibeCheck = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      updateEngineerReportVibeCheck(data, id),
    onSuccess: () => {
      toast.success("Engineer Report Vibe Check updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error updating engineer report Vibe check");
      console.error("Update Error:", error);
    },
  });
};

export const useCreateEngineerReportVisualCheck = () => {
  return useMutation({
    mutationFn: createEngineerReportVisualCheck,
    onSuccess: () => {
      toast.success("Engineer Report Vibe Check created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error creating engineer report Vibe check");
      console.error("Update Error:", error);
    },
  });
}; 

export const useUpdateEngineerReportVisualCheck = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      updateEngineerReportVisualCheck(data, id),
    onSuccess: () => {
      toast.success("Engineer report visual check updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error updating engineer report visual check");
      console.error("Update Error:", error);
    },
  });
};

export const useCreateEngineerReportResultCheck = () => {
  return useMutation({
    mutationFn: createEngineerReportResultCheck,
    onSuccess: () => {
      toast.success("Engineer Report Vibe Check created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error creating engineer report Vibe check");
      console.error("Update Error:", error);
    },
  });
};

export const useUpdateEngineerReportResultCheck = () => {
  return useMutation({
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      updateEngineerReportResultCheck(data, id),
    onSuccess: () => {
      toast.success("Engineer report result updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error updating engineer report result");
      console.error("Update Error:", error);
    },
  });
};

export const useGetEngineerReportCheckData = (id: string | null) => {
  return useQuery({
    queryKey: ["engineer", "report", "check", "data", id],
    queryFn: () => getEngineerReportCheckData(id),
    enabled: !!id,
  });
};

export const useGetEquipmentFromMars = () => {
  return useMutation({
    mutationFn: getEquipmentFromMars,
    onError: () => {
      toast.error("Error : Cannot get equipment from MARS");
    },
  });
};

export const useGetAllMeasureDataFromMars = () => {
  return useMutation({
    mutationFn: getAllMeasureDataFromMars,
    onError: () => {
      toast.error("Error : Cannot get all measure data from MARS");
    },
  });
};

export const useGetMeasureDataFromMars = () => {
  return useMutation({
    mutationFn: getMeasureDataFromMars,
    onError: () => {
      toast.error("Error : Cannot get measure data from MARS");
    },
  });
};
export const useGetWaveDataFromMars = () => {
  return useMutation({
    mutationFn: getWaveDatafromMars,
    onError: () => {
      toast.error("Error : Cannot get wave data from MARS");
    },
  });
};

export const useGetSpecTrumWaveDataFromMars = () => {
  return useMutation({
    mutationFn: getSpectrumWaveDatafromMars,
    onError: () => {
      toast.error("Error : Cannot get spectrum wave data from MARS");
    },
  });
};