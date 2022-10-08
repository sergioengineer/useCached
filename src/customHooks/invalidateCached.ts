
import { QueryClient } from "@tanstack/react-query";
import { TApiServiceKeys } from "./lib/TApiServiceKeys";
import { TQueryKey } from "./lib/TQueryKey";

export const invalidateCached = (
  client: QueryClient,
  key: TApiServiceKeys,
  ...aditionalKeys: TQueryKey[]
) => {
  client.invalidateQueries([key, ...aditionalKeys]);
};
