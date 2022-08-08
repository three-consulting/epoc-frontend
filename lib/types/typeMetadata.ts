export type FieldMetadata = { required: boolean }

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
