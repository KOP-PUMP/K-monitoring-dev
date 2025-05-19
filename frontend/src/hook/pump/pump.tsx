import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUnitLOV,
  getLOVById,
  createLOV,
  updateLOV,
  deleteLOV,
  getAllPumpLOV,
  getPumpDetailLOV,
  createPumpDetailLOV,
  deletePumpDetailLOV,
  updatePumpDetailLOV,
  getShaftSealDetailLOV,
  getMaterialDetailLOV,
  createMaterialLOV,
  updateMaterialLOV,
  deleteMaterialLOV,
  getMotorDetailLOV,
  createMotorLOV,
  updateMotorLOV,
  deleteMotorLOV,
  getMediaLOV,
  createMediaLOV,
  deleteMediaLOV,
  updateMediaLOV,
} from "@/api/pump/pump";
import { LOVData } from "@/types/table";
import {
  PumpDetailLOVResponse,
  MotorDetailLOVResponse,
  PumpMatLOVResponse,
  PumpShaftSealLOVResponse,
  MediaLOVResponse,
} from "@/types/pump/pumps";
import toast from "react-hot-toast";
import { get } from "http";

export const useGetAllUnitLOVData = () => {
  return useQuery<LOVData[]>({
    queryKey: ["pump", "unit_lov"],
    queryFn: getAllUnitLOV,
  });
};

export const useGetAllPumpLOVData = () => {
  return useQuery<LOVData[]>({
    queryKey: ["pump", "lov_list"],
    queryFn: getAllPumpLOV,
  });
};

export const useGetLOVById = (id: string | null) => {
  return useQuery<LOVData>({
    queryKey: ["pump", "lov", id],
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error("id is required"));
      }
      return getLOVById(id);
    },
  });
};

/* export const useDeleteLOVById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLOV(id),
    onSuccess: (isUnit : boolean) => {
      if(isUnit){
        queryClient.invalidateQueries({ queryKey: ["pump", "unit_lov"] });
      }else{
        queryClient.invalidateQueries({ queryKey: ["pump", "lov_list"] });
      }
      toast.success("LOV deleted successfully");
    },
    onError: () => {
      toast.error("Error deleting LOV");
    },
  });
}; */

export const useDeleteLOVById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteLOV(id),
    onSuccess: (data, variables: { id: string; isUnit: boolean }) => {
      const { isUnit } = variables;

      if (isUnit) {
        queryClient.invalidateQueries({ queryKey: ["pump", "unit_lov"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["pump", "lov_list"] });
      }

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
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      if (!id) {
        return Promise.reject(new Error("Id is required"));
      }
      return updateLOV({ id, data });
    },
    onSuccess: () => {
      toast.success("LOV updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error updating LOV");
      console.error("Update Error:", error);
    },
  });
};

/* Pump detail LOV Hook */ 

export const useGetPumpDetailLOV = (id: string | null) => {
  return useQuery<PumpDetailLOVResponse[]>({
    queryKey: ["pump", "pump-detail-lov", id],
    queryFn: () => getPumpDetailLOV(id),
  });
};

export const useCreatePumpDetailLOV = () => {
  return useMutation({
    mutationFn: createPumpDetailLOV,

    onSuccess: () => {
      toast.success("Pump detail LOV created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: () => {
      toast.error("Error creating pump detail LOV");
    },
  });
};

export const useDeletePumpDetailLOVById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id : string) => deletePumpDetailLOV(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pump", "pump-detail-lov"] });
      toast.success("Pump detail LOV deleted successfully")
    },
    onError: () => toast.error("Error deleting pump detail LOV"),
  });
};

export const useUpdatePumpDetailLOV = () => {
  return useMutation({
    mutationFn: ({ id, data } : { id: string; data: PumpDetailLOVResponse }) => updatePumpDetailLOV({ id, data }),
    onSuccess: () => {
      toast.success("Pump detail LOV updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error updating pump detail LOV");
      console.error("Update Error:", error);
    },
  });
};

/* Motor detail LOV Hook */ 

export const useGetMotorDetailLOV = (id: string | null) => {
  return useQuery<MotorDetailLOVResponse[]>({
    queryKey: ["motor", "motor_lov", id],
    queryFn: () => getMotorDetailLOV(id),
  });
};

export const useCreateMotorLOV = () => {
  return useMutation({
    mutationFn: createMotorLOV,
    onSuccess: () => {
      toast.success("Motor LOV created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: () => {
      toast.error("Error creating motor LOV");
    },
  });
};

export const useDeleteMotorLOVById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id : string) => deleteMotorLOV(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["motor", "motor_lov"]});
      toast.success("Motor LOV deleted successfully")
    },
    onError: () => toast.error("Error deleting motor LOV"),
  });
};

export const useUpdateMotorLOV = () => {
  return useMutation({
    mutationFn: ({ id, data } : { id: string; data: MotorDetailLOVResponse }) => updateMotorLOV({ id, data }),
    onSuccess: () => {
      toast.success("Motor LOV updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error updating motor LOV");
      console.error("Update Error:", error);
    },
  });
};

/* Material detail LOV API */

export const useGetMaterialDetailLOV = (id: string | null) => {
  return useQuery<PumpMatLOVResponse[]>({
    queryKey: ["material", "material_lov", id],
    queryFn: () => getMaterialDetailLOV(id),
  });
};

export const useCreateMaterialLOV = () => {
  return useMutation({
    mutationFn: createMaterialLOV,
    onSuccess: () => {
      toast.success("Material LOV created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: () => {
      toast.error("Error creating material LOV");
    },
  });
};

export const useDeleteMaterialLOVById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id : string) => deleteMaterialLOV(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material", "material_lov"]});
      toast.success("Material LOV deleted successfully")
    },
    onError: () => toast.error("Error deleting material LOV"),
  });
};

export const useUpdateMaterialLOV = () => {
  return useMutation({
    mutationFn: ({ id, data } : { id: string; data: PumpMatLOVResponse }) => updateMaterialLOV({ id, data }),
    onSuccess: () => {
      toast.success("Material LOV updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error updating material LOV");
      console.error("Update Error:", error);
    },
  });
};

/* Shaft/Seal detail LOV API */

export const useGetShaftSealDetailLOV = (id: string | null) => {
  return useQuery<PumpShaftSealLOVResponse[]>({
    queryKey: ["shaft_seal", "shaft_seal_lov", id],
    queryFn: () => getShaftSealDetailLOV(id),
  });
};

/* Media detail LOV API */

export const useGetMediaLOVData = (id: string | null) => {
  return useQuery<MediaLOVResponse[]>({
    queryKey: ["pump", "media_list", id],
    queryFn: () => getMediaLOV(id),
  });
};

export const useCreateMediaLOV = () => {
  return useMutation({
    mutationFn: createMediaLOV,

    onSuccess: () => {
      toast.success("media LOV created successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: () => {
      toast.error("Error creating media LOV");
    },
  });
};

export const useDeleteMediaLOVById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id : string) => deleteMediaLOV(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pump", "media_list"] });
      toast.success("LOV deleted successfully")
    },
    onError: () => toast.error("Error deleting LOV"),
  });
};

export const useUpdateMediaLOV = () => {
  return useMutation({
    mutationFn: ({ id, data } : { id: string; data: PumpMatLOVResponse }) => updateMediaLOV({ id, data }),
    onSuccess: () => {
      toast.success("Media LOV updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error updating media LOV");
      console.error("Update Error:", error);
    },
  });
};
