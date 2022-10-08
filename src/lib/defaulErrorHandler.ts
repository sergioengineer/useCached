import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { IProblemDto } from "../../../DTOs/Errors/ProblemDto";

export const defaultErrorHandler = (error: AxiosError) => {
  if (axios.isAxiosError(error)) {
    if (error.message.toLowerCase() == "network error") {
      toast.error(error.message + ": Verifique sua conexão com a internet");
      return;
    }
    if (error.response?.status == 403) {
      toast.error("Usuário não possui permissão de acesso para executar esta operação.");
      return;
    }
    if ((error as IProblemDto)?.response?.data?.detail != undefined) {
      const responseError = error as IProblemDto;
      toast.error(responseError.response?.data.detail as string);
      return;
    }
  }
  toast.error(error.message);
};
