import { useEffect, useState } from "react";
import { ApiService } from "../ApiService";
import { defaultErrorHandler } from "./lib/defaulErrorHandler";
import { TApiServiceKeys } from "./lib/TApiServiceKeys";

export const useApi = <T extends TApiServiceKeys>(
  api: T,
  ...params: Parameters<TApiService[T]>
) => {
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState<
    UnwrapPromise<ReturnType<TApiService[T]>> | undefined
  >(undefined);

  useEffect(() => {
    const load = async () => {
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
