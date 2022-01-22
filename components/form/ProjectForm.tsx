import { Button, FormControl, FormLabel, Input, Select, FormErrorMessage } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/layout';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ErrorAlert from '@/components/common/ErrorAlert';
import { ProjectDTO, EmployeeDTO, CustomerDTO } from '@/lib/types/dto';
import CustomerForm from './CustomerForm';
import { postProject, putProject } from '@/lib/const';

const emptyProject: ProjectDTO = {
    name: '',
    description: undefined,
    startDate: undefined,
    endDate: undefined,
    managingEmployee: undefined,
    customer: undefined,
    status: undefined,
};

type ProjectFormProps = {
    employees: EmployeeDTO[];
    customers: CustomerDTO[];
    method: string;
    project?: ProjectDTO;
};

function ProjectForm({ employees, customers, method, project: p }: ProjectFormProps): JSX.Element {
    const [project, setProject] = useState<ProjectDTO>(p || emptyProject);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();

    const handleCustomerChange = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = e.currentTarget.value;
        if (id) {
            const customer = customers.find((el) => el.id === Number(id));
            setProject({ ...project, customer: customer });
        }
    };

    const handleEmployeeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = e.currentTarget.value;
        if (id) {
            const employee = employees.find((el) => el.id === Number(id));
            setProject({ ...project, managingEmployee: employee });
        }
    };

    const createProject = async (project: ProjectDTO) => {
        await postProject(project);
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
                createProject(project);
            } else if (method === 'PUT') {
                updateProject(project);
            }
        } catch (error) {
            setErrorMessage(error.toString());
        }
    };

    const invalidEndDate = (project.startDate && project.endDate && project.startDate > project.endDate) || false;

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
                        value={project.name || ''}
                        placeholder="Project name"
                        onChange={(e) => setProject({ ...project, name: e.target.value })}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Project description</FormLabel>
                    <Input
                        value={project.description || ''}
                        placeholder="Project description"
                        onChange={(e) => setProject({ ...project, description: e.target.value })}
                    />
                </FormControl>
                <FormControl isRequired={true}>
                    <FormLabel>Start date</FormLabel>
                    <Input
                        type="date"
                        value={project.startDate || ''}
                        placeholder="Project start date"
                        onChange={(e) => setProject({ ...project, startDate: e.target.value })}
                    />
                </FormControl>
                <FormControl isInvalid={invalidEndDate}>
                    <FormLabel>End date</FormLabel>
                    <Input
                        type="date"
                        value={project.endDate || ''}
                        placeholder="Project end date"
                        onChange={(e) => setProject({ ...project, endDate: e.target.value })}
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
                                value={project.customer?.id}
                            >
                                {customers.map((customer, idx) => {
                                    return (
                                        <option key={idx} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    );
                                })}
                            </Select>
                            <CustomerForm />
                        </Flex>
                    </FormControl>
                </Flex>
                <FormControl isRequired={true}>
                    <FormLabel>Managing employee</FormLabel>
                    <Select
                        onChange={handleEmployeeChange}
                        placeholder="Select employee"
                        value={project.managingEmployee?.id}
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
