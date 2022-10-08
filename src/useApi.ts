import { useEffect, useState } from "react";
import { ApiService } from "./ApiService";
import { defaultErrorHandler } from "./lib/defaulErrorHandler";
import { TApiServiceKeys } from "./lib/TApiServiceKeys";

/**
 * @summary hook que permite chamar uma API uma única vez após o mount do componente.
 * Similar à componentDidMount.
 * @param api - chave da api para ser chamada
 * @param params - parametros da api definida no service
 * @returns um objeto contendo um booleando indicando se a api ainda está carregando(isloading) e
 * , o dado retornado pela api(data)
 */
export const useApi = <T extends TApiServiceKeys>(
  api: T,
  ...params: Parameters<TApiService[T]>
) => {
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState<
    UnwrapPromise<ReturnType<TApiService[T]>>["data"] | undefined
  >(undefined);

  useEffect(() => {
    const load = async () => {
      /** O tipo do this de um método estático é sempre a referência para a classe,
       *  mas o typescript não reconhece isso na v4.8.2. Possívelmente esse cast pode ser removido
       * em uma versão mais nova
       * */
      (
        ApiService[api] as (
          this: InstanceType<TApiService>,
          ...params: Parameters<TApiService[T]>
        ) => ReturnType<TApiService[T]>
      )
        .apply(ApiService, params)
        .then((r) => {
          const { data: apiData } = r;
          setData(apiData);
          setisLoading(false);
        })
        .catch(defaultErrorHandler);
    };
    load();
  }, []);

  return { isLoading, data };
};

type TApiService = typeof ApiService;
type UnwrapPromise<T> = T extends Promise<infer VALUE> ? VALUE : T;
