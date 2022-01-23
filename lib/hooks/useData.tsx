import { useMemo, useState } from 'react';
import { ResponseWithStatus } from '../utils/fetch';

type ReturnType<T> =
    | {
          isSuccess: true;
          isLoading: false;
          isError: false;
          data: T;
      }
    | {
          isSuccess: false;
          isLoading: false;
          isError: true;
          errorMessage: string;
      }
    | {
          isSuccess: false;
          isLoading: true;
          isError: false;
      };

function useDataInternalState<T>(request: Promise<ResponseWithStatus<T>>): ReturnType<T> {
    const [response, setResponse] = useState<ResponseWithStatus<T>>();
    request.then(setResponse);

    if (response) {
        if (response.isSuccess) {
            return { isSuccess: true, isLoading: false, isError: false, data: response.data };
        } else {
            return { isSuccess: false, isLoading: false, isError: true, errorMessage: response.errorMessage };
        }
    } else {
        return { isSuccess: false, isLoading: true, isError: false };
    }
}

function useData<T>(callback: () => Promise<ResponseWithStatus<T>>): [ReturnType<T>, () => void] {
    const [callCount, setCallCount] = useState(0);
    const internalResponse = useMemo(callback, [callCount]);
    const response = useDataInternalState(internalResponse);
    const refresh = () => setCallCount(callCount + 1);
    return [response, refresh];
}

export default useData;
