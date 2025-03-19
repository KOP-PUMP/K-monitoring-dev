import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUnitLOV,
  getLOVById,
  createLOV,
  updateLOV,
  deleteLOV,
  getAllPumpLOV,
  getPumpDetailLOV,
  getShaftSealDetailLOV,
  getMatDetailLOV,
  getMotorDetailLOV,
} from "@/api/pump/pump";
import { LOVData } from "@/types/table";
import { PumpDetailLOVResponse, MotorDetailLOVResponse, PumpMatLOVResponse, ShaftSealLOVResponse } from "@/types/pump/pumps";
import toast from "react-hot-toast";

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
export const useGetPumpDetailLOV = (id: string | null) => {
  return useQuery<PumpDetailLOVResponse[]>({
    queryKey: ["pump", "pump_lov", id],
    queryFn: () => getPumpDetailLOV(id),
  });
};

export const useGetMotorDetailLOV = (id: string | null) => {
  return useQuery<MotorDetailLOVResponse[]>({
    queryKey: ["motor", "motor_lov", id],
    queryFn: () => getMotorDetailLOV(id),
  });
};

export const useGetMatDetailLOV = (id: string | null) => {
  return useQuery<PumpMatLOVResponse[]>({
    queryKey: ["material", "material_lov", id],
    queryFn: () => getMatDetailLOV(id),
  });
};

export const useGetShaftSealDetailLOV = (id: string | null) => {
  return useQuery<ShaftSealLOVResponse[]>({
    queryKey: ["shaft_seal", "shaft_seal_lov", id],
    queryFn: () => getShaftSealDetailLOV(id),
  });
};

