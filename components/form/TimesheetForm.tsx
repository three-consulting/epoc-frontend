import { useUpdateTimesheets } from '@/lib/hooks/useTimesheets';
import { Employee, Project, Timesheet } from '@/lib/types/apiTypes';
import { FormBase } from '@/lib/types/forms';
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Select } from '@chakra-ui/react';
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

type TimesheetFormProps = FormBase & {
    project: Project;
    projectId: number;
    employees: Employee[];
};

export function CreateTimesheetForm({ project, projectId, employees, afterSubmit }: TimesheetFormProps): JSX.Element {
    const [timesheetFields, setTimesheetFields] = useState<TimesheetFields>({ project });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { postTimesheet } = useUpdateTimesheets();

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

    const submitTimesheet = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await postTimesheet(validateTimesheetFields(timesheetFields, projectId), () => {
                undefined;
            });
            afterSubmit && afterSubmit();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    const invalidAllocation =
        (timesheetFields.allocation && (timesheetFields.allocation < 0 || timesheetFields.allocation > 100)) || false;

    return (
        <>
            <div style={{ padding: '20px' }}>
                <FormControl>
                    <FormLabel>User</FormLabel>
                    <Select onChange={setEmployee} placeholder="Select employee">
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
                <Button colorScheme="blue" mr={3} onClick={submitTimesheet}>
                    Submit
                </Button>
                <Button colorScheme="gray" onClick={afterSubmit}>
                    Cancel
                </Button>
            </div>
            {errorMessage ? (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            ) : null}
        </>
    );
}
