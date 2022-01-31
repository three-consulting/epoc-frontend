import { useUpdateTimesheets } from '@/lib/hooks/useTimesheets';
import { Employee, Project, Timesheet } from '@/lib/types/apiTypes';
import { FormBase } from '@/lib/types/forms';
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Select } from '@chakra-ui/react';
import React, { useState } from 'react';
import ErrorAlert from '../common/ErrorAlert';

type TimesheetFields = Partial<Timesheet> & {
    project: Project;
};

const validateTimesheetFields = (fields: TimesheetFields, projectId: number): Timesheet => {
    const { name, project, employee } = fields;
    if (name && project && employee) {
        return {
            ...fields,
            project: { ...project, id: projectId },
            name,
            employee,
        };
    } else {
        throw 'Invalid timesheet form: Missing required fields';
    }
};

type TimesheetFormProps = CreateTimesheetFormProps & {
    timesheet?: Timesheet;
    timesheetId?: number;
    onSubmit: (timesheet: Timesheet) => void;
};

function TimesheetForm({
    timesheet: timesheetOrNull,
    project,
    projectId,
    employees,
    onSubmit,
    onCancel,
}: TimesheetFormProps): JSX.Element {
    const [timesheetFields, setTimesheetFields] = useState<TimesheetFields>(timesheetOrNull || { project });

    const [errorMessage, setErrorMessage] = useState<string>('');
    const errorHandler = (error: Error) => setErrorMessage(`${error}`);

    const setEmployee = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = parseInt(e.currentTarget.value);
        if (id && employees) {
            const employee = employees.find((employee) => employee.id === id);
            if (employee) {
                setTimesheetFields({ ...timesheetFields, employee: { ...employee }, project: { ...project } });
            } else {
                throw `Error timesheet form could not find employee with id ${id}.`;
            }
        }
    };

    const invalidAllocation =
        (timesheetFields.allocation && (timesheetFields.allocation < 0 || timesheetFields.allocation > 100)) || false;

    const abortSubmission = onCancel ? onCancel : () => undefined;

    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    try {
                        const timesheet = validateTimesheetFields(timesheetFields, projectId);
                        onSubmit(timesheet);
                    } catch (error) {
                        errorHandler(error as Error);
                    }
                }}
            >
                <div style={{ padding: '20px' }}>
                    <FormControl>
                        <FormLabel>User</FormLabel>
                        <Select
                            value={timesheetFields.employee?.id || undefined}
                            onChange={setEmployee}
                            placeholder="Select employee"
                        >
                            {employees.map((employee, idx) => {
                                return (
                                    <option key={idx} value={employee.id}>
                                        {`${employee.first_name} ${employee.last_name}`}
                                    </option>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Timesheet Name</FormLabel>
                        <Input
                            value={timesheetFields.name || ''}
                            placeholder="Timesheet Name"
                            onChange={(e) =>
                                setTimesheetFields({
                                    ...timesheetFields,
                                    name: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Input
                            value={timesheetFields.description || ''}
                            placeholder="Description"
                            onChange={(e) =>
                                setTimesheetFields({
                                    ...timesheetFields,
                                    description: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                    <FormControl isInvalid={invalidAllocation}>
                        <FormLabel>Allocation</FormLabel>
                        <Input
                            value={timesheetFields.allocation || ''}
                            placeholder="0"
                            onChange={(e) =>
                                setTimesheetFields({
                                    ...timesheetFields,
                                    allocation: parseInt(e.target.value),
                                })
                            }
                        />
                        <FormErrorMessage>Allocation needs to be between 1 and 100 %.</FormErrorMessage>
                    </FormControl>
                </div>
                <div style={{ textAlign: 'right', padding: '20px' }}>
                    <Button colorScheme="blue" mr={3} type="submit">
                        Submit
                    </Button>
                    <Button colorScheme="gray" onClick={abortSubmission}>
                        Cancel
                    </Button>
                </div>
                {errorMessage && (
                    <>
                        <ErrorAlert />
                        <Box>{errorMessage}</Box>
                    </>
                )}
            </form>
        </Flex>
    );
}

type CreateTimesheetFormProps = FormBase<Timesheet> & {
    employees: Employee[];
    project: Project;
    projectId: number;
};

export const CreateTimesheetForm = (props: CreateTimesheetFormProps): JSX.Element => {
    const { postTimesheet } = useUpdateTimesheets();

    const [errorMessage, setErrorMessage] = useState<string>('');
    const errorHandler = (error: Error) => setErrorMessage(`${error}`);

    const onSubmit = async (timesheet: Timesheet) => {
        const newTimesheet = await postTimesheet(timesheet, errorHandler);
        props.afterSubmit && props.afterSubmit(newTimesheet);
    };

    return (
        <>
            <TimesheetForm {...props} timesheet={undefined} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    );
};

type EditTimesheetFormProps = CreateTimesheetFormProps & {
    timesheet: Timesheet;
    timesheetId: number;
};

export const EditTimesheetForm = (props: EditTimesheetFormProps): JSX.Element => {
    const { putTimesheet } = useUpdateTimesheets();

    const [errorMessage, setErrorMessage] = useState<string>('');
    const errorHandler = (error: Error) => setErrorMessage(`${error}`);

    const onSubmit = async (timesheet: Timesheet) => {
        const updatedTimesheet = await putTimesheet(timesheet, errorHandler);
        props.afterSubmit && props.afterSubmit(updatedTimesheet);
    };

    return (
        <>
            <TimesheetForm {...props} onSubmit={onSubmit} />
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    );
};
