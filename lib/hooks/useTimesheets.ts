import useSWR, { useSWRConfig } from 'swr';
import { TimesheetDTO } from '../types/dto';
import { get, post, put } from '../utils/fetch';
import { swrToData, ApiResponseType } from '../types/swrUtil';

const timesheetEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/timesheet`;

type ReturnType = {
    timesheetsResponse: ApiResponseType<TimesheetDTO[]>;
    postTimesheet: (timesheet: TimesheetDTO) => void;
    putTimesheet: (timesheet: TimesheetDTO) => void;
};

function useTimesheets(projectId: number): ReturnType {
    const { mutate } = useSWRConfig();

    const timesheetsResponse = swrToData(
        useSWR<TimesheetDTO[], Error>(timesheetEndpointURL, () => get(timesheetEndpointURL, { projectId: projectId })),
    );
    const postTimesheet = async (timesheet: TimesheetDTO) => {
        const response = await post(timesheetEndpointURL, timesheet);
        mutate(timesheetEndpointURL);
        return response;
    };
    const putTimesheet = async (timesheet: TimesheetDTO) => {
        const response = await put(timesheetEndpointURL, timesheet);
        mutate(timesheetEndpointURL);
        return response;
    };
    return { timesheetsResponse, postTimesheet, putTimesheet };
}

export default useTimesheets;
