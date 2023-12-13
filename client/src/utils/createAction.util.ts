type Action<T> = { type: T }

type ActionPayload<T, P> = { type: T; payload: P }

export function createAction<T extends string>(
  type: T,
  payload: void,
): Action<T>

export function createAction<T extends string, P>(
  type: T,
  payload: P,
): ActionPayload<T, P>

export function createAction<T extends string, P = undefined>(
  type: T,
  payload: P,
): ActionPayload<T, P> {
  return { type, payload }
}
