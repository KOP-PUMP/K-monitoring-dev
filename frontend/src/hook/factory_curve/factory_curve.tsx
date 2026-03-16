import {
  getFactoryCurveData,
  getFactoryCurveNumber,
  getCalPumpData,
} from "@/api/factory_curve/factory_curve_data";
import { FactoryCurveDataResponse } from "@/types/factory_curve/factory_curve_data";
import { useQuery, useMutation} from "@tanstack/react-query";

export const useGetFactoryCurveData = (
  model: string | null,
  speed: string | null,
  factory_no: string | null
) => {
  return useQuery<FactoryCurveDataResponse[]>({
    queryKey: ["factory_curve", model, speed, factory_no],
    queryFn: () => getFactoryCurveData(model, speed, factory_no),
  });
};

export const useGetFactoryCurveNumber = () => {
  return useQuery({
    queryKey: ["factory_curve", "number"],
    queryFn: () => getFactoryCurveNumber(),
  });
};

export const useGetCalPumpData = () =>{
  return useMutation({
    mutationFn: getCalPumpData,
  })
}
