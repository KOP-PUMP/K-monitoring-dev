import { useMutation, useQuery } from "@tanstack/react-query";
import { getPECPersonByCode, createUser, getUserProfile } from "@/api/user/users";
import toast from "react-hot-toast";

export const useGetPECPersonByCode = (code: string) => {
    return useQuery({
        queryKey: ["pec_person", code],
        queryFn: () => getPECPersonByCode(code),
    });
};

export const useGetUserProfile = (role: 'Customer' | 'Member') => {
    return useQuery({
        queryKey: ["user_profile", role],
        queryFn: () => getUserProfile(role),
        enabled: !!role,
    })
}

export const useCreateUser = () => {
    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            toast.success("User created successfully");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        },
        onError: (error) => {
            toast.error("Error creating user");
            console.log("Create User Error :", error);
        }
    })
}



