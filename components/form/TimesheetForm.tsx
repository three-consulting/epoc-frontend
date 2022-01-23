import { TimesheetDTO, ProjectDTO, EmployeeDTO } from '@/lib/types/dto';
import { postTimesheet } from '@/lib/utils/apiRequests';
import { FormControl, FormLabel, Select, Input, FormErrorMessage, ModalFooter, Button, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import ErrorAlert from '../common/ErrorAlert';

type TimesheetFields = Partial<TimesheetDTO> & {
    project: ProjectDTO;
};

const validateTimesheetFields = (fields: TimesheetFields): TimesheetDTO => {
    const { name, project, employee } = fields;
    if (name && project && employee) {
        return {
            ...fields,
            name,
            project,
            employee,
        };
    } else {
        throw 'Invalid timesheet form: Missing required fields';
    }
};

interface TimesheetFormProps {
    project: ProjectDTO;
    refreshTimesheets: () => void;
    employees: EmployeeDTO[];
    onClose: () => void;
}

export function TimesheetForm({ project, refreshTimesheets, employees, onClose }: TimesheetFormProps): JSX.Element {
    const [timesheetFields, setTimesheetFields] = useState<TimesheetFields>({ project });
    const [errorMessage, setErrorMessage] = useState<string>('');

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
            await postTimesheet(validateTimesheetFields(timesheetFields));
            await refreshTimesheets();
            onClose();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    const invalidAllocation =
        (timesheetFields.allocation && (timesheetFields.allocation < 0 || timesheetFields.allocation > 100)) || false;

    return (
        <>
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
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={submitTimesheet}>
                    Submit
                </Button>
                <Button colorScheme="gray" onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
            {errorMessage ? (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            ) : null}
        </>
    );
}
