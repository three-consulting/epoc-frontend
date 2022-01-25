import useSWR, { useSWRConfig } from 'swr';
import { Task } from '../types/apiTypes';
import { get, post, put } from '../utils/fetch';
import { swrToData, ApiResponseType } from '../types/swrUtil';

const taskEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/task`;

type TaskList = {
    tasksResponse: ApiResponseType<Task[]>;
};

type UpdateTasks = {
    postTask: (task: Task, errorHandler: (error: Error) => void) => Promise<Task | undefined>;
    putTask: (task: Task, errorHandler: (error: Error) => void) => Promise<Task | undefined>;
};

function useTasks(projectId: number): TaskList {
    const tasksResponse = swrToData(
        useSWR<Task[], Error>(taskEndpointURL, () => get(taskEndpointURL, { projectId: projectId })),
    );
    return { tasksResponse };
}

export const useUpdateTasks = (): UpdateTasks => {
    const { mutate } = useSWRConfig();

    const postTask = async (task: Task, errorHandler: (error: Error) => void) => {
        const newTask = await post<Task, Task>(taskEndpointURL, task).catch(errorHandler);
        mutate(taskEndpointURL);
        return newTask || undefined;
    };

    const putTask = async (task: Task, errorHandler: (error: Error) => void) => {
        const updatedTask = await put<Task, Task>(taskEndpointURL, task).catch(errorHandler);
        mutate(taskEndpointURL);
        return updatedTask || undefined;
    };
    return { postTask, putTask };
};

export default useTasks;
