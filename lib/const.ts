export const projectEndpointURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/project`);
export const customerEndpointURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/customer`);
export const taskEndpointURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/task`);
export const employeeEndpointURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/employee`);
export const timesheetEndpointURL = new URL(`${process.env.NEXT_PUBLIC_API_URL}/timesheet`);

export const projectIdEndpointURL = (id: string): URL => new URL(`${process.env.NEXT_PUBLIC_API_URL}/project/${id}`);
export const timesheetIdEndpointURL = (id: string): URL =>
    new URL(`${process.env.NEXT_PUBLIC_API_URL}/timesheet/${id}`);
