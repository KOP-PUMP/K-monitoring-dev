import { useQuery } from "@tanstack/react-query";
import { getFactoryCurveData, getFactoryCurveNumber } from "@/api/factory_curve/factory_curve_data";
import { FactoryCurveDataResponse } from "@/types/factory_curve/factory_curve_data";

export const useGetFactoryCurveData = (factory_no: string) => {
    return useQuery<FactoryCurveDataResponse[]>({
        queryKey: ["factory_curve", factory_no],
        queryFn: () => getFactoryCurveData(factory_no),
    })
};

export const useGetFactoryCurveNumber = () => {
    return useQuery({
        queryKey: ["factory_curve", "number"],
        queryFn: () => getFactoryCurveNumber(),
    })
};