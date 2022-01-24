import useSWR, { useSWRConfig } from 'swr';
import { TaskDTO } from '../types/dto';
import { get, post } from '../utils/fetch';
import { swrToData, ApiResponseType } from '../types/swrUtil';

const taskEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/task`;

type ReturnType = {
    tasksResponse: ApiResponseType<TaskDTO[]>;
    postTask: (task: TaskDTO) => void;
};

function useTasks(projectId: number): ReturnType {
    const { mutate } = useSWRConfig();

    const tasksResponse = swrToData(
        useSWR<TaskDTO[], Error>(taskEndpointURL, () => get(taskEndpointURL, { projectId: projectId })),
    );
    const postTask = async (task: TaskDTO) => {
        const response = await post(taskEndpointURL, task);
        mutate(taskEndpointURL);
        return response;
    };
    return { tasksResponse, postTask };
}

export default useTasks;
