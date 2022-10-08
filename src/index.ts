import { QueryClient } from "@tanstack/react-query";
import { invalidateCached } from "./customHooks/invalidateCached";
import { useCached } from "./customHooks/useCached";

() => {
  /**
   * With this hook we can ask reactQuery to use the method defined inside the ApiService
   *  without losing autocompletion and typesafety while having access to additional paramters
   */
  const { data, isLoading, isError, isFetching } = useCached("articlesGet", 2, {
    onResponse(response) {},
    onError(axiosError) {},
  });

  const client = null as unknown as QueryClient;
  invalidateCached(client, "usersGet");
};
