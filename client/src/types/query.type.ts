import { QueryKey } from '@tanstack/react-query';

export type QueryFnArg = {
  queryKey: QueryKey;
  signal: AbortSignal;
  meta: Record<string, unknown> | undefined;
};
