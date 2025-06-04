import {
  FactoryCurveDataResponse,
  FactoryCurveNumberResponse,
} from "@/types/factory_curve/factory_curve_data";
import { axiosInstance } from "../utils";
import {
  PumpDetailCalDataOut,
  PumpDetailCalResponse,
} from "@/types/factory_curve/factory_curve_data";

export const getFactoryCurveData = async (
  model: string | null,
  speed: string | null,
  factory_no: string | null
): Promise<FactoryCurveDataResponse[]> => {
  if ((!model || !speed) && !factory_no) {
    return [];
  }
  try {
    const splitData = model?.split(" ");
    const response = await axiosInstance.get(
      `/factory-curve/data?${factory_no ? `factory_no=${factory_no}` : `model=${splitData?.[0]}&size=${splitData?.[1]}&speed=${speed}`}`
    );
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
    const response = await axiosInstance.get("/factory-curve/number");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching factory curve number:", error);
    throw new Error("Failed to fetch factory curve number");
  }
};


export const getCalPumpData = async (data: PumpDetailCalDataOut) => {
  try {
    //const response = await axiosInstance.get(
    //  `/factory-curve/cal?operation_flow=${data.operation_flow}&operation_flow_unit=${data.operation_flow_unit}&operation_head=${data.operation_head}&operation_head_unit=${data.operation_head_unit}&impeller_dia=${data.impeller_dia}&model=${data.model}&speed=${data.speed}&size=${data.size}` );
    const response = await axiosInstance.post("/factory-curve/cal",data)
    return response.data.data

  } catch (error: any) {
    console.error("Error get cal data", error.message || error);
    throw new Error(error.message || "Fail to get calculate data");
  }
};
