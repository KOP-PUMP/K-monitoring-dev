import { useQuery } from "@tanstack/react-query";
import { getPECPersonByCode } from "@/api/user/users";

export const useGetPECPersonByCode = (code: string) => {
    return useQuery({
        queryKey: ["pec_person", code],
        queryFn: () => getPECPersonByCode(code),
    });
};