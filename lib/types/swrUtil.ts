export type ApiResponseType<T> =
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

export type swrType<T> = { data?: T; error?: { message: string } };

export const swrToData = <T>({ data, error }: swrType<T>): ApiResponseType<T> => {
    if (error) {
        return { isSuccess: false, isLoading: false, isError: true, errorMessage: error.message };
    } else if (!data) {
        return { isSuccess: false, isLoading: true, isError: false };
    } else {
        return { isSuccess: true, isLoading: false, isError: false, data: data };
    }
};
