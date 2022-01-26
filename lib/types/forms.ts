import { ApiUpdateResponse } from './hooks';

export type FormBase<T> = {
    afterSubmit?: (returnValue: ApiUpdateResponse<T>) => void;
    onCancel?: () => void;
};
