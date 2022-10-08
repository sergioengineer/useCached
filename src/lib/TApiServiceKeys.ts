import { ApiService } from "../ApiService";

export type TApiServiceKeys = Exclude<keyof typeof ApiService, "prototype">;
