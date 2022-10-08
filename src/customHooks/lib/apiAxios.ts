import axios, { AxiosInstance, AxiosResponse } from "axios";

export const apiAxios = axios as unknown as TExtension;
type keys = "post" | "get" | "put" | "postForm" | "putForm";

type TExtension = Omit<AxiosInstance, keys> & {
  [key in keys]: <T>(
    ...params: Parameters<AxiosInstance[key]>
  ) => AxiosResponse<ApiResponseDTO<T>>;
};

interface ApiResponseDTO<T>{
  data:T;
  success: boolean;
}