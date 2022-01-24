import useSWR, { useSWRConfig } from 'swr';
import { Task } from '../types/apiTypes';
import { get, post } from '../utils/fetch';
import { swrToData, ApiResponseType } from '../types/swrUtil';

const taskEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/task`;

type ReturnType = {
    tasksResponse: ApiResponseType<Task[]>;
    postTask: (task: Task) => void;
};

function useTasks(projectId: number): ReturnType {
    const { mutate } = useSWRConfig();

    const tasksResponse = swrToData(
        useSWR<Task[], Error>(taskEndpointURL, () => get(taskEndpointURL, { projectId: projectId })),
    );
    const postTask = async (task: Task) => {
        const response = await post(taskEndpointURL, task);
        mutate(taskEndpointURL);
        return response;
    };
    return { tasksResponse, postTask };
}

export default useTasks;
