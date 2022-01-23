import { Button, FormControl, FormLabel, Input, Select, FormErrorMessage } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ErrorAlert from '@/components/common/ErrorAlert';
import { ProjectDTO, EmployeeDTO, CustomerDTO, ProjectStatus } from '@/lib/types/dto';
import CustomerForm from './CustomerForm';
import { postProject, putProject } from '@/lib/utils/apiRequests';

type ProjectFields = Partial<ProjectDTO> & { status: ProjectStatus };

const validateProjectFields = (form: ProjectFields): ProjectDTO => {
    const { name, startDate, customer, managingEmployee, status } = form;
    if (name && startDate && customer && managingEmployee && status) {
        return {
            ...form,
            name,
            startDate,
            customer,
            managingEmployee,
            status,
        };
    } else {
        throw 'Invalid project form: missing required fields';
    }
};

type ProjectFormPropsBase = {
    employees: EmployeeDTO[];
    customers: CustomerDTO[];
    refreshCustomers: () => void;
};

type ProjectFormProps =
    | (ProjectFormPropsBase & { method: 'POST'; project: undefined })
    | (ProjectFormPropsBase & { method: 'PUT'; project: ProjectDTO });

function ProjectForm({
    employees,
    customers,
    refreshCustomers,
    method,
    project: projectOrNull,
}: ProjectFormProps): JSX.Element {
    const router = useRouter();
    const [projectFields, setProjectFields] = useState<ProjectFields>(projectOrNull || { status: 'ACTIVE' });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleCustomerChange = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = e.currentTarget.value;
        if (id) {
            const customer = customers.find((el) => el.id === Number(id));
            setProjectFields({ ...projectFields, customer: customer });
        }
    };

    const handleEmployeeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = e.currentTarget.value;
        if (id) {
            const employee = employees.find((el) => el.id === Number(id));
            setProjectFields({ ...projectFields, managingEmployee: employee });
        }
    };

    const createProject = async (project: ProjectDTO) => {
        await postProject(validateProjectFields(project));
        router.push('/projects');
    };

    const updateProject = async (project: ProjectDTO) => {
        const { id } = router.query;
        project.id = parseInt(`${id}`);
        putProject(project);
        router.push(`/projects/${id}`);
    };

    const submitForm = async () => {
        try {
            if (method === 'POST') {
                createProject(validateProjectFields(projectFields));
            } else if (method === 'PUT') {
                updateProject(validateProjectFields(projectFields));
            }
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    const invalidEndDate =
        (projectFields.startDate && projectFields.endDate && projectFields.startDate > projectFields.endDate) || false;

    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            {errorMessage ? <ErrorAlert message={errorMessage} /> : null}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submitForm();
                }}
            >
                <FormControl isRequired={true}>
                    <FormLabel>Project name</FormLabel>
                    <Input
                        value={projectFields.name || ''}
                        placeholder="Project name"
                        onChange={(e) => setProjectFields({ ...projectFields, name: e.target.value })}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Project description</FormLabel>
                    <Input
                        value={projectFields.description || ''}
                        placeholder="Project description"
                        onChange={(e) => setProjectFields({ ...projectFields, description: e.target.value })}
                    />
                </FormControl>
                <FormControl isRequired={true}>
                    <FormLabel>Start date</FormLabel>
                    <Input
                        type="date"
                        value={projectFields.startDate || ''}
                        placeholder="Project start date"
                        onChange={(e) => setProjectFields({ ...projectFields, startDate: e.target.value })}
                    />
                </FormControl>
                <FormControl isInvalid={invalidEndDate}>
                    <FormLabel>End date</FormLabel>
                    <Input
                        type="date"
                        value={projectFields.endDate || ''}
                        placeholder="Project end date"
                        onChange={(e) => setProjectFields({ ...projectFields, endDate: e.target.value })}
                    />
                    <FormErrorMessage>End date precedes start date</FormErrorMessage>
                </FormControl>
                <Flex flexDirection="row" justifyContent="center">
                    <FormControl isRequired={true}>
                        <FormLabel>Customer</FormLabel>
                        <Flex flexDirection="row" justifyContent="space-between">
                            <Select
                                onChange={handleCustomerChange}
                                placeholder="Select customer"
                                marginRight="0.3rem"
                                value={projectFields.customer?.id}
                            >
                                {customers.map((customer, idx) => {
                                    return (
                                        <option key={idx} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    );
                                })}
                            </Select>
                            <CustomerForm refreshCustomers={refreshCustomers} />
                        </Flex>
                    </FormControl>
                </Flex>
                <FormControl isRequired={true}>
                    <FormLabel>Managing employee</FormLabel>
                    <Select
                        onChange={handleEmployeeChange}
                        placeholder="Select employee"
                        value={projectFields.managingEmployee?.id}
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
                <br />
                <Button colorScheme="blue" type="submit">
                    Submit
                </Button>
                <Button colorScheme="gray" type="button" marginLeft="0.5rem" onClick={() => router.push('/projects')}>
                    Cancel
                </Button>
            </form>
        </Flex>
    );
}

export default ProjectForm;
