import { AxiosError } from "axios";

export const defaultErrorHandler = (error: AxiosError) => {
  alert(error.message);
};
