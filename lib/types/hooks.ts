export type ApiGetResponse<T> =
    | {
          isSuccess: true
          isLoading: false
          isError: false
          data: T
      }
    | {
          isSuccess: false
          isLoading: false
          isError: true
          errorMessage: string
      }
    | {
          isSuccess: false
          isLoading: true
          isError: false
      }

export type ApiUpdateResponse<T> =
    | {
          isSuccess: true
          isError: false
          data: T
      }
    | {
          isSuccess: false
          isError: true
      }

export type UpdateHookArgs<T> = [updatedObject: T, errorHandler: (error: Error) => void]
export type UpdateHookFunction<T> = (...args: UpdateHookArgs<T>) => Promise<ApiUpdateResponse<T>>

export type swrType<T> = { data?: T; error?: { message: string } }

export const swrToApiGetResponse = <T>({ data, error }: swrType<T>): ApiGetResponse<T> => {
    if (error) {
        return { isSuccess: false, isLoading: false, isError: true, errorMessage: error.message }
    } else if (!data) {
        return { isSuccess: false, isLoading: true, isError: false }
    } else {
        return { isSuccess: true, isLoading: false, isError: false, data: data }
    }
}

export const updateToApiUpdateResponse = <T>(response?: T): ApiUpdateResponse<T> =>
    response ? { isSuccess: true, isError: false, data: response } : { isSuccess: false, isError: true }
