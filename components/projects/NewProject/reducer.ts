import { ProjectDTO } from '@/lib/types/api';

export enum FormStatus {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
}

type FormState = ProjectDTO & { formStatus: FormStatus };

export enum ActionType {
    SET_NAME = 'SET_NAME',
    SET_DESCRIPTION = 'SET_DESCRIPTION',
    SET_END_DATE = 'SET_END_DATE',
    SET_START_DATE = 'SET_START_DATE',
    SET_MANAGING_EMPLOYEE = 'SET_MANAGING_EMPLOYEE',
    SET_CUSTOMER = 'SET_CUSTOMER',
    SET_STATUS = 'SET_STATUS',
    SET_FORM_STATUS = 'SET_FORM_STATUS',
    RESET = 'RESET',
}

export type Action =
    | {
          type: ActionType.SET_NAME;
          payload: { name: ProjectDTO['name'] };
      }
    | { type: ActionType.SET_DESCRIPTION; payload: { description: ProjectDTO['description'] } }
    | { type: ActionType.SET_END_DATE; payload: { endDate: ProjectDTO['endDate'] } }
    | { type: ActionType.SET_START_DATE; payload: { startDate: ProjectDTO['startDate'] } }
    | {
          type: ActionType.SET_MANAGING_EMPLOYEE;
          payload: { managingEmployee: ProjectDTO['managingEmployee'] };
      }
    | {
          type: ActionType.SET_CUSTOMER;
          payload: { customer: ProjectDTO['customer'] };
      }
    | { type: ActionType.SET_STATUS; payload: { status: ProjectDTO['status'] } }
    | { type: ActionType.SET_FORM_STATUS; payload: { formStatus: FormStatus } }
    | { type: ActionType.RESET; payload: FormState };

export const init = (initialState: FormState): FormState => initialState;

export const initialState: FormState = {
    name: '',
    description: undefined,
    startDate: undefined,
    endDate: undefined,
    managingEmployee: undefined,
    customer: undefined,
    status: undefined,
    formStatus: FormStatus.IDLE,
};

const reducer = (state: FormState, action: Action): FormState => {
    switch (action.type) {
        case ActionType.SET_NAME:
            return { ...state, name: action.payload.name };
        case ActionType.SET_DESCRIPTION:
            return { ...state, description: action.payload.description };
        case ActionType.SET_END_DATE:
            return { ...state, endDate: action.payload.endDate };
        case ActionType.SET_START_DATE:
            return { ...state, startDate: action.payload.startDate };
        case ActionType.SET_MANAGING_EMPLOYEE:
            return { ...state, managingEmployee: action.payload.managingEmployee };
        case ActionType.SET_CUSTOMER:
            return { ...state, customer: action.payload.customer };
        case ActionType.SET_STATUS:
            return { ...state, status: action.payload.status };
        case ActionType.SET_FORM_STATUS:
            return { ...state, formStatus: action.payload.formStatus };
        case ActionType.RESET:
            return init(action.payload);
    }
};

export default reducer;
