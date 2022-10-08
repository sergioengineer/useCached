import { keys } from "@mui/system";
import { AxiosInstance, AxiosResponse } from "axios";
import { axios } from "../../../connetions";
import { ApiResponseDTO } from "../../../DTOs/API/ApiResponseDTO";

/**
 * objeto de conveniência para declaração de APIs.
 * Ele automaticamente irá envolver o tipo de um DTO com ApiResponseDTO.
 * Caso queria declarar sua api usando o axios comum, você terá que especificar o tipo completo
 * do retorno da api.
 *  eg. axios.post<ApiResponseDTO< DemandasSummaryDTO > >(...parametros)
 * Com esse objeto é possível tornar a declaração mais sucinta.
 *  eg. apiAxios.post< DemandasSummaryDTO >(...parametros)
 */
export const apiAxios = axios as unknown as TExtension;
type keys = "post" | "get" | "put" | "postForm" | "putForm";

type TExtension = Omit<AxiosInstance, keys> & {
  [key in keys]: <T>(
    ...params: Parameters<AxiosInstance[key]>
  ) => AxiosResponse<ApiResponseDTO<T>>;
};
