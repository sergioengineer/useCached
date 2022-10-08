import { ApiResponseDTO } from "../../DTOs/API/ApiResponseDTO";
import {
  AreaSolicitanteDto,
  DemandaAreasSolicitantesDto,
} from "../../DTOs/AreasSolicitantes/AreaSolicitanteDto";
import { ClienteSummaryDTO } from "../../DTOs/Clientes/ClienteSummaryDTO";
import { DemandaFilter } from "../../DTOs/Demanda/DemandaFilter";
import { DemandaSummaryDTO } from "../../DTOs/Demanda/DemandaSummaryDTO";
import { DemandaPodemAtenderDto } from "../../DTOs/DemandaPodemAtender/DemandaPodemAtenderDto";
import { MovimentacaoSummaryDTO } from "../../DTOs/Movimentacao/MovimentacaoSummaryDTO";
import { SeveridadeDto } from "../../DTOs/Severidade/SeveridadeDto";
import { StatusSummaryDTO } from "../../DTOs/Status/StatusSummaryDTO";
import { TipoDemandaSummaryDTO } from "../../DTOs/TipoDemanda/TipoDemandaSummaryDTO";
import { UsuarioDto } from "../../DTOs/Usuario/UsuarioDto";
import { UsuarioSummaryDTO } from "../../DTOs/Usuario/UsuarioSummaryDTO";
import { apiAxios } from "./lib/apiAxios";

export abstract class ApiService {
  ////// DEMANDAS
  static async demandasSearch(filters: Maybe<DemandaFilter>[]) {
    return await apiAxios.post<DemandaSummaryDTO[]>("/api/demandas/search", {
      Filters: filters,
    });
  }

  static async demandasAreasSolicitantesGetAll(idDemanda?: number) {
    const query = idDemanda !== undefined ? "?idDemanda=" + idDemanda : "";
    return await apiAxios.get<DemandaAreasSolicitantesDto[]>(
      "api/demandasAreasSolicitantes" + query
    );
  }

  static async demandasPodemAtenderUsuariosGetAll() {
    return await apiAxios.get<UsuarioDto[]>("api/demandasPodemAtender/getall");
  }

  static async demandasPodemAtenderGetAll(idDemanda?: number) {
    return await apiAxios.get<DemandaPodemAtenderDto[]>(
      `api/demandasPodemAtender${idDemanda != undefined ? "?idDemanda=" + idDemanda : ""}`
    );
  }

  static async demandasGet(idDemanda: number) {
    return await apiAxios.get<DemandaSummaryDTO>("/api/demandas" + "/" + idDemanda);
  }

  static async demandasGetAll() {
    return await apiAxios.get<DemandaSummaryDTO[]>("/api/demandas");
  }

  ///// STATUS
  static async statusGetAll(filtro?: ActiveOnly) {
    return await apiAxios.get<StatusSummaryDTO[]>(
      "/api/status" + (filtro ? "?ativo=" + filtro : "")
    );
  }

  //// CLIENTES
  static async clientesGetAll(filtro?: ActiveOnly) {
    return await apiAxios.get<ClienteSummaryDTO[]>(
      "/api/clientes" + (filtro ? filtro : "")
    );
  }
  //// SEVERIDADES
  static async severidadesGetAll() {
    return await apiAxios.get<SeveridadeDto[]>("/api/severidades");
  }

  //// MOVIMENTACOES
  static async movimentacoesGetAll(demandaId?: number) {
    /**simula uma resposta vazia caso demandaId não esteja definido */
    if (demandaId === undefined)
      return {
        data: undefined,
        success: false,
      } as ApiResponseDTO<undefined>;

    return await apiAxios.get<MovimentacaoSummaryDTO[]>(
      "/api/movimentacoes" + "/" + demandaId
    );
  }

  //// USUARIOS
  static async usuariosGetAll() {
    return await apiAxios.get<UsuarioSummaryDTO[]>("/api/usuarios");
  }

  //// AREAS SOLICITANTES
  static async areasSolicitantesGetAll(active?: "all" | "active" | "inactive") {
    const activeFilter = active !== undefined ? `?ativo=${active}` : "";
    return await apiAxios.get<AreaSolicitanteDto[]>(
      "api/areasSolicitantes" + activeFilter
    );
  }

  //// TIPO DEMANDAS
  static async tipoDemandasGetAll() {
    return await apiAxios.get<TipoDemandaSummaryDTO[]>("/api/tipodemandas");
  }

  ////PENDING READ
  static async pendingReadGetAllIds() {
    return await apiAxios.get<{ id: number }[]>("/api/demandas/pending");
  }
}

type Maybe<T> = T | undefined | null;
type ActiveOnly = "all" | "active" | "inactive";
