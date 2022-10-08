import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { ApiService } from "./ApiService";
import { defaultErrorHandler } from "./lib/defaulErrorHandler";
import { TAddParams } from "./lib/TAddParams";
import { TApiServiceKeys } from "./lib/TApiServiceKeys";
import { TQueryKey } from "./lib/TQueryKey";

/**
 * @summary hook que permite chamar uma API e manter o resultado em cache de acordo
 *  com as regras do react query.
 * As chaves de cache do reactQuery serão geradas a partir dos parâmetros passados para a hook
 * e o nome da api chamada.
 * @param api - chave da api para ser chamada
 * @param params - parametros da api definida no service
 * @param options Um objeto com as opções de execução da query(@see {Options})
 * @returns um objeto contendo um booleando indicando se a api ainda está carregando(isloading) e
 * , o dado retornado pela api(data)
 */
export const useCached = <T extends TApiServiceKeys>(
  api: T,
  ...params:
    | Parameters<TAddParams<UseCached<T>, [options: Options<T>]>>
    | Parameters<TApiService[T]>
) => {
  let cacheKeys = [api, ...params] as TQueryKey[];
  let options: Options<T>;
  const forwardParams = params as Parameters<TApiService[T]>;

  //Se o usuário passou um parâmetro a mais, então o ultimo argumento é Options
  if (ApiService[api].length !== params.length) {
    options = params[ApiService[api].length] as Options<T>;

    cacheKeys = [...cacheKeys, ...(options?.cacheKeys || [])];
  }

  const { isLoading, data, isFetching, isError } = useQuery(cacheKeys, async () => {
    try {
      const response = await (
        ApiService[api] as (
          this: InstanceType<TApiService>,
          ...params: Parameters<TApiService[T]>
        ) => ReturnType<TApiService[T]>
      ).apply(ApiService, forwardParams); /**
            existem parametros adicionais, mas que serão descartados pelo apply
        */

      //Chamada do callback feita dentro de uma promise a fim de evitar
      // que exceções geradas pelo callback interfiram no funcionamento correto da hook
      await (async () =>
        options?.onResponse?.(
          //hotfix:typescript consegue inferenciar o tipo de retorno, mas mesmo assim gera erro?!
          response as Awaited<ReturnType<TApiService[T]>>
        ))().catch((error) => {
        console.error("onResponse(useCached) error: ", {
          error,
          params,
        });
      });

      /**
       * Segundo cast necessário porque o typescript se embanana com o uso de genéricos e não consegu
       * inferir o tipo de retorno(cria um tuple com todos os retornos de todos os métods sem o cast)
       */
      return response.data as UnwrapPromise<ReturnType<TApiService[T]>>["data"];
    } catch (error) {
      if (!options?.onError?.(error as AxiosError))
        defaultErrorHandler(error as AxiosError);

      /**
       * O erro é repropagado a fim de manter o funcionamento do reactQuery's isError
       */
      throw error;
    }
  });

  return { isLoading, data, isFetching, isError };
};

type TApiService = typeof ApiService;

type UseCached<T> = <T extends TApiServiceKeys>(
  ...params: Parameters<TApiService[T]>
) => UseCachedReturn<Awaited<ReturnType<TApiService[T]>>["data"]> | undefined;

interface UseCachedReturn<T> {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  data: T;
}

interface Options<T extends TApiServiceKeys> {
  /**
   * Chaves de cache extras à serem adicionadas à chamada de useQuery
   */
  cacheKeys?: TQueryKey[];

  /**
   * Callback que será chamado após a execução da api e receberá a resposta do axios.
   */
  onResponse?: (response: Awaited<ReturnType<TApiService[T]>>) => unknown;

  /**
   * Callback que será chamado caso ocorra algum erro
   * @returns true se o erro for handled pelo callback(nesse caso o default erro handler não será chamado)
   */
  onError?: (axiosError: AxiosError) => boolean | void;
}

type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;
