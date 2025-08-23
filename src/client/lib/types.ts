// This is a bug. Linter thinks that any enum is overshadowing itself.
// eslint-disable-next-line no-shadow
export enum CollisionType {
  ROOM = 'room',
  TEACHER = 'teacher',
  CAPACITY = 'capacity',
  OUTLOOK = 'outlook',
}

export type RouteLink = '/' | '/settings' | '/ignored';
export type APIResponse<Payload> =
  | {
      success: true;
      payload: Payload;
    }
  | {
      success: false;
      error: string;
    };
export type StateType<T> = {
  step: string;
  error: string;
  isLoading: boolean;
  payload: T;
};
// This is a typescript bug. The enum overshadowing itself.
// eslint-disable-next-line no-shadow
export enum ActionType {
  REQUEST_IN_PROGRESS = 1,
  REQUEST_SUCCESSFUL = 2,
  REQUEST_FAILED = 3,
}

export type Action<T> =
  | {
      type: ActionType.REQUEST_IN_PROGRESS;
      step: string;
    }
  | {
      type: ActionType.REQUEST_FAILED;
      error: string;
    }
  | {
      type: ActionType.REQUEST_SUCCESSFUL;
      payload: T;
    };
export type APIFunction<T, Args extends unknown[]> = (
  updateRequestState: (arg0: string) => void,
  ...args: Args
) => Promise<APIResponse<T>>;
