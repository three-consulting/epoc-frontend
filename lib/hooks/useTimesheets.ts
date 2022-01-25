import useSWR, { useSWRConfig } from 'swr';
import { Timesheet } from '../types/apiTypes';
import { get, post, put } from '../utils/fetch';
import { swrToData, ApiResponseType } from '../types/swrUtil';

const timesheetEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/timesheet`;

type TimesheetList = {
    timesheetsResponse: ApiResponseType<Timesheet[]>;
};

type UpdateTimesheets = {
    postTimesheet: (timesheet: Timesheet, errorHandler: (error: Error) => void) => Promise<Timesheet | undefined>;
    putTimesheet: (timesheet: Timesheet, errorHandler: (error: Error) => void) => Promise<Timesheet | undefined>;
};

export const useTimesheets = (projectId: number): TimesheetList => {
    const timesheetsResponse = swrToData(
        useSWR<Timesheet[], Error>(timesheetEndpointURL, () => get(timesheetEndpointURL, { projectId: projectId })),
    );
    return { timesheetsResponse };
};

export const useUpdateTimesheets = (): UpdateTimesheets => {
    const { mutate } = useSWRConfig();

    const postTimesheet = async (timesheet: Timesheet, errorHandler: (error: Error) => void) => {
        const newTimesheet = await post<Timesheet, Timesheet>(timesheetEndpointURL, timesheet).catch(errorHandler);
        mutate(timesheetEndpointURL);
        return newTimesheet || undefined;
    };

    const putTimesheet = async (timesheet: Timesheet, errorHandler: (error: Error) => void) => {
        const newTimesheet = await put<Timesheet, Timesheet>(timesheetEndpointURL, timesheet).catch(errorHandler);
        mutate(timesheetEndpointURL);
        return newTimesheet || undefined;
    };

    return { postTimesheet, putTimesheet };
};
