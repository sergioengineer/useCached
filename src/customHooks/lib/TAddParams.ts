export type TAddParams<
  TFunction extends (...params: any) => any,
  TParams extends [Object]
> = (...args: [...Parameters<TFunction>, ...TParams]) => ReturnType<TFunction>;
