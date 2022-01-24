import useSWR, { useSWRConfig } from 'swr';
import { Task } from '../types/apiTypes';
import { get, post } from '../utils/fetch';
import { swrToData, ApiResponseType } from '../types/swrUtil';

const taskEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/task`;

type TaskList = {
    tasksResponse: ApiResponseType<Task[]>;
};

type UpdateTasks = {
    postTask: (task: Task) => void;
};

function useTasks(projectId: number): TaskList {
    const tasksResponse = swrToData(
        useSWR<Task[], Error>(taskEndpointURL, () => get(taskEndpointURL, { projectId: projectId })),
    );
    return { tasksResponse };
}

export const useUpdateTasks = (): UpdateTasks => {
    const { mutate } = useSWRConfig();

    const postTask = async (task: Task) => {
        const response = await post(taskEndpointURL, task);
        mutate(taskEndpointURL);
        return response;
    };
    return { postTask };
};

export default useTasks;
