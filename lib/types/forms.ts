export type FormBase<T> = {
    afterSubmit?: (returnValue: T | undefined) => void;
    onCancel?: () => void;
};
