import { SENDER } from "../constants";

export type ValueOf<T> = T[keyof T];
export type SenderType = ValueOf<typeof SENDER>;
