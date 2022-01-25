import { useUpdateProjects } from '@/lib/hooks/useProjects';
import { Customer, Employee, Project } from '@/lib/types/apiTypes';
import { FormBase } from '@/lib/types/forms';
import { Flex } from '@chakra-ui/layout';
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { CreateCustomerForm } from './CustomerForm';

type ProjectFields = Partial<Project>;

const validateProjectFields = (form: ProjectFields): Project => {
    const { name, startDate, customer, managingEmployee } = form;
    if (name && startDate && customer && managingEmployee) {
        return {
            ...form,
            name,
            startDate,
            customer,
            managingEmployee,
        };
    } else {
        throw 'Invalid project form: missing required fields';
    }
};

type ProjectFormProps = CreateProjectFormProps & {
    project?: Project;
    projectId?: number;
    onSubmit: (project: Project) => void;
};

function ProjectForm({ project: projectOrNull, customers, employees, onSubmit, onCancel }: ProjectFormProps) {
    const [projectFields, setProjectFields] = useState<ProjectFields>(projectOrNull || {});
    const [displayCreateCustomerForm, setDisplayCreateCustomerForm] = useState(false);
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

    const invalidEndDate =
        (projectFields.startDate && projectFields.endDate && projectFields.startDate > projectFields.endDate) || false;
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
                    onSubmit(validateProjectFields(projectFields));
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

                            <Button onClick={() => setDisplayCreateCustomerForm(true)}>Add Customer</Button>
                            <Modal
                                closeOnOverlayClick={false}
                                isOpen={displayCreateCustomerForm}
                                onClose={() => setDisplayCreateCustomerForm(false)}
                            >
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Add New Customer</ModalHeader>
                                    <ModalCloseButton />
                                    <CreateCustomerForm afterSubmit={() => setDisplayCreateCustomerForm(false)} />
                                </ModalContent>
                            </Modal>
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
                <Button colorScheme="gray" type="button" marginLeft="0.5rem" onClick={abortSubmission}>
                    Cancel
                </Button>
            </form>
        </Flex>
    );
}

type CreateProjectFormProps = FormBase<Project> & {
    employees: Employee[];
    customers: Customer[];
};

export const CreateProjectForm = (props: CreateProjectFormProps): JSX.Element => {
    const { postProject } = useUpdateProjects();
    const onSubmit = async (project: Project) => {
        const newProject = await postProject(project, () => {
            undefined;
        });
        props.afterSubmit && props.afterSubmit(newProject);
    };
    return <ProjectForm {...props} project={undefined} onSubmit={onSubmit} />;
};

type EditProjectFormProps = CreateProjectFormProps & {
    project: Project;
    projectId: number;
};

export const EditProjectForm = (props: EditProjectFormProps): JSX.Element => {
    const { putProject } = useUpdateProjects();
    const onSubmit = async (project: Project) => {
        const updatedProject = await putProject(project, () => {
            undefined;
        });
        props.afterSubmit && props.afterSubmit(updatedProject);
    };
    return <ProjectForm {...props} onSubmit={onSubmit} />;
};
