type Client = {
    id: number;
    name: string;
    description: string;
    created: string;
    updated: string;
};

type TimeCategory = {
    id: number;
    name: string;
    description: string;
    created: string;
    updated: string;
};

type Employee = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    start_date: string;
    created: string;
    updated: string;
};

type Project = {
    id: number;
    client_id: number;
    managing_employee_id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    created: string;
    updated?: string;
};

export type { Client, TimeCategory, Employee, Project };
