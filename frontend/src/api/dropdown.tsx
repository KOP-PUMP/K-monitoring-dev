import { axiosInstanceProvince } from "./utils";
import { ThaiProvincesResponse } from "@/types/dropdown";

export const getProvince = async () : Promise<ThaiProvincesResponse[]> => {
  try {
    const result = await axiosInstanceProvince.get(`/province.json`);
    return result.data;
  } catch (error) {
    console.error("Error cannot get province data from API", error);
    throw new Error("Error cannot get province data from API:");
  }
};
