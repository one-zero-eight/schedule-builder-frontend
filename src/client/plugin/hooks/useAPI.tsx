import { useReducer } from 'react';

import {
  ActionType,
  StateType,
  Action,
  APIResponse,
} from '../../lib/api/types';

function reducerLogic<T>(state: StateType<T>, action: Action<T>): StateType<T> {
  switch (action.type) {
    case ActionType.REQUEST_IN_PROGRESS:
      return { ...state, step: action.step, error: '', isLoading: true };
    case ActionType.REQUEST_FAILED:
      return {
        ...state,
        step: '',
        error: action.error,
        isLoading: false,
      };
    case ActionType.REQUEST_SUCCESSFUL:
      return {
        error: '',
        step: '',
        isLoading: false,
        payload: action.payload,
      };
    default:
      return {
        ...state,
        error: 'Contact developers. Reached default case for reducer',
      };
  }
}

type ExtractAPIFunction<T> = T extends (
  updateRequestState: (step: string) => void,
  ...args: infer P
) => Promise<APIResponse<infer R>>
  ? { params: P; returnType: R }
  : never;

export default function useAPI<
  F extends (
    updateRequestState: (step: string) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    APIResponse<any>
  >
>(apiFunction: F, defaultValue: ExtractAPIFunction<F>['returnType']) {
  type TReturn = ExtractAPIFunction<F>['returnType'];
  type TArgs = ExtractAPIFunction<F>['params'];
  const [requestState, dispatch] = useReducer<
    React.Reducer<StateType<TReturn>, Action<TReturn>>
  >(reducerLogic, {
    step: '',
    error: '',
    isLoading: false,
    payload: defaultValue,
  });

  function updateRequestStep(step: string) {
    dispatch({
      type: ActionType.REQUEST_IN_PROGRESS,
      step,
    });
  }

  async function callAPI(...args: TArgs) {
    const response = await apiFunction(updateRequestStep, ...args);

    if (response.success) {
      dispatch({
        type: ActionType.REQUEST_SUCCESSFUL,
        payload: response.payload as TReturn,
      });
    } else {
      dispatch({
        type: ActionType.REQUEST_FAILED,
        error: response.error,
      });
    }
  }

  return [callAPI, requestState] as const;
}
