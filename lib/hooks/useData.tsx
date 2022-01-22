import { useState } from 'react';
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

function useData<T>(request: Promise<ResponseWithStatus<T>>): ReturnType<T> {
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

export default useData;
