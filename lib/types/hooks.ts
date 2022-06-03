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

export type UpdateHookArgs<T> = [
    updatedObject: T,
    errorHandler: (error: Error) => void
]
export type UpdateHookFunction<T> = (
    ...args: UpdateHookArgs<T>
) => Promise<ApiUpdateResponse<T>>

export type DeleteHookArgs = [id: number, errorHandler: (error: Error) => void]
export type DeleteHookFunction = (...args: DeleteHookArgs) => Promise<void>

export interface UpdateHook<T> {
    post: UpdateHookFunction<T>
    put: UpdateHookFunction<T>
    delete: DeleteHookFunction
}

export type swrType<T> = { data?: T; error?: { message: string } }

export const swrToApiGetResponse = <T>({
    data,
    error,
}: swrType<T>): ApiGetResponse<T> => {
    if (error) {
        return {
            isSuccess: false,
            isLoading: false,
            isError: true,
            errorMessage: error.message,
        }
    } else if (!data) {
        return { isSuccess: false, isLoading: true, isError: false }
    }
    return { isSuccess: true, isLoading: false, isError: false, data }
}

export const updateToApiUpdateResponse = <T>(
    response: T | null
): ApiUpdateResponse<T> =>
    response === null
        ? { isSuccess: false, isError: true }
        : { isSuccess: true, isError: false, data: response }
