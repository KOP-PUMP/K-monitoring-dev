import { FactoryCurveDataResponse,
  FactoryCurveNumberResponse,
} from "@/types/factory_curve/factory_curve_data";
import { axiosInstance } from "../utils";

export const getFactoryCurveData = async (
  factory_no: string
): Promise<FactoryCurveDataResponse[]> => {
  if (!factory_no) {
    return [];
  }
  try {
    const response = await axiosInstance.get(`/factory-curve/data/${factory_no}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching factory curve data:", error);
    throw new Error("Failed to fetch factory curve data");
  }
};

export const getFactoryCurveNumber = async (): Promise<
  FactoryCurveNumberResponse[]
> => {
  try {
    const response = await axiosInstance.get(
      "/factory-curve/number"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching factory curve number:", error);
    throw new Error("Failed to fetch factory curve number");
  }
};
