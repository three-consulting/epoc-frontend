export type FieldMetadata = { required: boolean }

export const customerFieldMetadata: Record<string, FieldMetadata> = {
    id: { required: false },
    name: { required: true },
    description: { required: false },
    created: { required: false },
    updated: { required: false },
    enabled: { required: false },
}

export const employeeFieldMetadata: Record<string, FieldMetadata> = {
    id: { required: false },
    firstName: { required: true },
    lastName: { required: true },
    email: { required: true },
    startDate: { required: false },
    created: { required: false },
    updated: { required: false },
}

export const projectFieldMetadata: Record<string, FieldMetadata> = {
    id: { required: false },
    name: { required: true },
    description: { required: false },
    startDate: { required: true },
    endDate: { required: false },
    customer: { required: true },
    managingEmployee: { required: true },
    status: { required: false },
    created: { required: false },
    updated: { required: false },
}

export const timesheetFieldMetadata: Record<string, FieldMetadata> = {
    id: { required: false },
    name: { required: true },
    description: { required: false },
    rate: { required: true },
    allocation: { required: false },
    project: { required: true },
    employee: { required: true },
    created: { required: false },
    updated: { required: false },
    status: { required: false },
}

export const taskFieldMetadata: Record<string, FieldMetadata> = {
    id: { required: false },
    name: { required: true },
    description: { required: false },
    project: { required: true },
    created: { required: false },
    updated: { required: false },
    billable: { required: true },
    status: { required: false },
}

export const timecategoryFieldMetadata: Record<string, FieldMetadata> = {
    id: { required: false },
    name: { required: true },
    description: { required: false },
    created: { required: false },
    updated: { required: false },
}

export const timesheetentryFieldMetadata: Record<string, FieldMetadata> = {
    id: { required: false },
    quantity: { required: true },
    date: { required: true },
    description: { required: false },
    timesheet: { required: true },
    timeCategory: { required: true },
    task: { required: true },
    created: { required: false },
    updated: { required: false },
}
