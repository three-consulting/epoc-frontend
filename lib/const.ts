import { CustomerDTO, EmployeeDTO, ProjectDTO, TaskDTO, TimesheetDTO } from './types/dto';
import { get, post, put, ResponseWithStatus } from './utils/fetch';

const projectEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/project`;
const customerEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/customer`;
const taskEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/task`;
const employeeEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/employee`;
const timesheetEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/timesheet`;
const projectIdEndpointURL = (id: number): string => `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`;

export const getProject = (projectId: number): Promise<ResponseWithStatus<ProjectDTO>> =>
    get<ProjectDTO>(projectIdEndpointURL(projectId));
export const listProjects = (): Promise<ResponseWithStatus<ProjectDTO[]>> => get<ProjectDTO[]>(projectEndpointURL);

export const listCustomers = (): Promise<ResponseWithStatus<CustomerDTO[]>> => get<CustomerDTO[]>(customerEndpointURL);
export const listEmployees = (): Promise<ResponseWithStatus<EmployeeDTO[]>> => get<EmployeeDTO[]>(employeeEndpointURL);
export const listTimesheets = (projectId: number): Promise<ResponseWithStatus<TimesheetDTO[]>> =>
    get<TimesheetDTO[]>(timesheetEndpointURL, { projectId: projectId });
export const listTasks = (projectId: number): Promise<ResponseWithStatus<TaskDTO[]>> =>
    get<TaskDTO[]>(taskEndpointURL, { projectId: projectId });

export const postProject = (project: ProjectDTO): Promise<ResponseWithStatus<ProjectDTO>> =>
    post<ProjectDTO, ProjectDTO>(projectEndpointURL, project);
export const postTask = (task: TaskDTO): Promise<ResponseWithStatus<TaskDTO>> =>
    post<TaskDTO, TaskDTO>(taskEndpointURL, task);
export const postCustomer = (customer: CustomerDTO): Promise<ResponseWithStatus<CustomerDTO>> =>
    post<CustomerDTO, CustomerDTO>(customerEndpointURL, customer);
export const postTimesheet = (timesheet: TimesheetDTO): Promise<ResponseWithStatus<TimesheetDTO>> =>
    post<TimesheetDTO, TimesheetDTO>(timesheetEndpointURL, timesheet);

export const putProject = (project: ProjectDTO): Promise<ResponseWithStatus<ProjectDTO>> =>
    put<ProjectDTO, ProjectDTO>(projectEndpointURL, project);
export const putTimesheet = (timesheet: TimesheetDTO): Promise<ResponseWithStatus<TimesheetDTO>> =>
    put<TimesheetDTO, TimesheetDTO>(timesheetEndpointURL, timesheet);
