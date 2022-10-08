import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiService } from "../ApiService";
import { defaultErrorHandler } from "./lib/defaulErrorHandler";
import { TAddParams } from "./lib/TAddParams";
import { TApiServiceKeys } from "./lib/TApiServiceKeys";
import { TQueryKey } from "./lib/TQueryKey";

export const useCached = <T extends TApiServiceKeys>(
  api: T,
  ...params:
    | Parameters<TAddParams<UseCached, [options: Options<T>]>>
    | Parameters<TApiService[T]>
) => {
  let cacheKeys = [api, ...params] as TQueryKey[];
  let options: Options<T>;
  const forwardParams = params as Parameters<TApiService[T]>;

  if (ApiService[api].length !== params.length) {
    options = params[ApiService[api].length] as Options<T>;

    cacheKeys = [...cacheKeys, ...(options?.cacheKeys || [])];
  }

  const { isLoading, data, isFetching, isError } = useQuery(
    cacheKeys,
    async () => {
      try {
        const response = await (
          ApiService[api] as (
            this: InstanceType<TApiService>,
            ...params: Parameters<TApiService[T]>
          ) => ReturnType<TApiService[T]>
        ).apply(ApiService, forwardParams);

        await (async () =>
          options?.onResponse?.(
            response as Awaited<ReturnType<TApiService[T]>>
          ))().catch((error) => {
          console.error("onResponse(useCached) error: ", {
            error,
            params,
          });
        });

        return response as UnwrapPromise<ReturnType<TApiService[T]>>;
      } catch (error) {
        if (!options?.onError?.(error as AxiosError))
          defaultErrorHandler(error as AxiosError);

        throw error;
      }
    }
  );

  return { isLoading, data, isFetching, isError };
};

type TApiService = typeof ApiService;

type UseCached = <T extends TApiServiceKeys>(
  ...params: Parameters<TApiService[T]>
) => never;

interface Options<T extends TApiServiceKeys> {
  cacheKeys?: TQueryKey[];

  onResponse?: (response: Awaited<ReturnType<TApiService[T]>>) => unknown;

  onError?: (axiosError: AxiosError) => boolean | void;
}

type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;
