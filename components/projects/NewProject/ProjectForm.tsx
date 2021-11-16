import { Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import reducer, { init, initialState, ActionType, FormStatus } from './reducer';
import { Box, Flex } from '@chakra-ui/layout';
import React, { useReducer } from 'react';
import { components } from '@/lib/types/api';
import { useRouter } from 'next/router';
import * as fetch from '@/lib/utils/fetch';
import ErrorAlert from '@/components/common/ErrorAlert';
import NewCustomer from '@/components/projects/NewProject/NewCustomer';

type ProjectFormProps = {
    employees?: components['schemas']['EmployeeDTO'][];
    customers?: components['schemas']['CustomerDTO'][];
    method?: string;
};
function ProjectForm({ employees, customers, method }: ProjectFormProps): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    const router = useRouter();

    const url = `${process.env.NEXT_PUBLIC_API_URL}/project`;

    const handleCustomerChange = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = e.currentTarget.value;
        if (id) {
            const customer = customers?.find((el) => el.id === Number(id));
            dispatch({ type: ActionType.SET_CUSTOMER, payload: { customer: customer } });
        }
    };

    const handleEmployeeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const id = e.currentTarget.value;
        if (id) {
            const employee = employees?.find((el) => el.id === Number(id));
            dispatch({ type: ActionType.SET_MANAGING_EMPLOYEE, payload: { managingEmployee: employee } });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const createProjectRequest: components['schemas']['ProjectDTO'] = {
            id: state.id,
            name: state.name,
            description: state.description,
            startDate: state.startDate,
            endDate: state.endDate,
            customer: {
                id: state.customer?.id,
                name: state.customer?.name as string,
            },
            managingEmployee: {
                id: state.managingEmployee?.id,
                first_name: state.managingEmployee?.first_name,
                last_name: state.managingEmployee?.last_name,
                email: state.managingEmployee?.email,
            },
        };

        try {
            if (method === 'POST') {
                await fetch.post(url, createProjectRequest);
                dispatch({ type: ActionType.SET_FORM_STATUS, payload: { formStatus: FormStatus.SUCCESS } });
                router.push('/projects');
            } else if (method === 'PUT') {
                const { id } = router.query;
                createProjectRequest.id = parseInt(`${id}`);
                await fetch.put(url, createProjectRequest);
                dispatch({ type: ActionType.SET_FORM_STATUS, payload: { formStatus: FormStatus.SUCCESS } });
                router.push(`/projects/${id}`);
            }
        } catch (error) {
            dispatch({ type: ActionType.SET_FORM_STATUS, payload: { formStatus: FormStatus.ERROR } });
        }
    };

    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            {state.formStatus == 'ERROR' ? <ErrorAlert></ErrorAlert> : <Box></Box>}
            <form
                onSubmit={(e) => {
                    handleSubmit(e);
                }}
            >
                <FormControl isRequired={true}>
                    <FormLabel>Project name</FormLabel>
                    <Input
                        value={state.name ? state.name : ''}
                        placeholder="Project name"
                        onChange={(e) => dispatch({ type: ActionType.SET_NAME, payload: { name: e.target.value } })}
                    ></Input>
                </FormControl>
                <FormControl>
                    <FormLabel>Project description</FormLabel>
                    <Input
                        value={state.description ? state.description : ''}
                        placeholder="Project description"
                        onChange={(e) =>
                            dispatch({ type: ActionType.SET_DESCRIPTION, payload: { description: e.target.value } })
                        }
                    ></Input>
                </FormControl>
                <FormControl isRequired={true}>
                    <FormLabel>Start date</FormLabel>
                    <Input
                        type="date"
                        value={state.startDate ? state.startDate : ''}
                        placeholder="Project start date"
                        onChange={(e) =>
                            dispatch({ type: ActionType.SET_START_DATE, payload: { startDate: e.target.value } })
                        }
                    ></Input>
                </FormControl>
                <FormControl>
                    <FormLabel>End date</FormLabel>
                    <Input
                        type="date"
                        value={state.endDate ? state.endDate : ''}
                        placeholder="Project end date"
                        onChange={(e) =>
                            dispatch({ type: ActionType.SET_END_DATE, payload: { endDate: e.target.value } })
                        }
                    ></Input>
                </FormControl>
                <Flex flexDirection="row" justifyContent="center">
                    <FormControl isRequired={true}>
                        <FormLabel>Customer</FormLabel>
                        <Flex flexDirection="row" justifyContent="space-between">
                            <Select onChange={handleCustomerChange} placeholder="Select customer" marginRight="0.3rem">
                                {customers?.map((customer, idx) => {
                                    return (
                                        <option key={idx} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    );
                                })}
                            </Select>
                            <NewCustomer />
                        </Flex>
                    </FormControl>
                </Flex>
                <FormControl isRequired={true}>
                    <FormLabel>Managing employee</FormLabel>
                    <Select onChange={handleEmployeeChange} placeholder="Select employee">
                        {employees?.map((el, idx) => {
                            return (
                                <option key={idx} value={el.id}>
                                    {`${el.first_name} ${el.last_name}`}
                                </option>
                            );
                        })}
                    </Select>
                </FormControl>
                <br />
                <Button
                    colorScheme="blue"
                    type="submit"
                    onClick={() =>
                        dispatch({
                            type: ActionType.SET_FORM_STATUS,
                            payload: { formStatus: FormStatus.LOADING },
                        })
                    }
                >
                    Submit
                </Button>
            </form>
        </Flex>
    );
}

export default ProjectForm;
