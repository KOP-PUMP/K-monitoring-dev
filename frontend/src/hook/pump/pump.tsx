import { useQuery,useMutation } from "@tanstack/react-query";
import { getAllUnitLOV,getLOVById,createLOV,updateLOV } from "@/api/pump/pump"; 
import { LOVOut } from "@/types"; 

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

export const useCreateLOV = () => {
    return useMutation({
        mutationFn: createLOV,
    });
};

export const useUpdateLOV = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateLOV({ id, data })
    });
};


