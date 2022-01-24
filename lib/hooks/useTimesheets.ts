import useSWR, { useSWRConfig } from 'swr';
import { Timesheet } from '../types/apiTypes';
import { get, post, put } from '../utils/fetch';
import { swrToData, ApiResponseType } from '../types/swrUtil';

const timesheetEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/timesheet`;

type TimesheetList = {
    timesheetsResponse: ApiResponseType<Timesheet[]>;
};

type UpdateTimesheets = {
    postTimesheet: (timesheet: Timesheet) => void;
    putTimesheet: (timesheet: Timesheet) => void;
};

export const useTimesheets = (projectId: number): TimesheetList => {
    const timesheetsResponse = swrToData(
        useSWR<Timesheet[], Error>(timesheetEndpointURL, () => get(timesheetEndpointURL, { projectId: projectId })),
    );
    return { timesheetsResponse };
};

export const useUpdateTimesheets = (): UpdateTimesheets => {
    const { mutate } = useSWRConfig();

    const postTimesheet = async (timesheet: Timesheet) => {
        const response = await post(timesheetEndpointURL, timesheet);
        mutate(timesheetEndpointURL);
        return response;
    };
    const putTimesheet = async (timesheet: Timesheet) => {
        const response = await put(timesheetEndpointURL, timesheet);
        mutate(timesheetEndpointURL);
        return response;
    };

    return { postTimesheet, putTimesheet };
};
