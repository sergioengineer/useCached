import { apiAxios } from "./customHooks/lib/apiAxios";

export abstract class ApiService {
  static async usersGet(filters: Filter[]) {
    const data = await apiAxios.post<User[]>("address1", {
      filters,
    });

    return data?.data?.data;
  }

  static async articlesGet(id: number) {
    const data = await apiAxios.get<Article>("address2/" + id);
    return data?.data?.data;
  }
}

interface Filter {
  operation: "equals" | "startsWith" | "endsWith";
  value: string;
}

interface User {
  id: number;
  name: string;
  surname: string;
  playsLol: boolean;
}

interface Article {
  id: number;
  title: string;
  text: string;
}
