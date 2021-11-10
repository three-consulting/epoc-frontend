import { Button, FormControl, FormLabel, Input, Select, Text } from '@chakra-ui/react';
import reducer, { init, initialState, ActionType, FormStatus } from './reducer';
import { Box, Flex } from '@chakra-ui/layout';
import React, { useReducer } from 'react';
import { components } from '@/lib/types/api';
import { useRouter } from 'next/router';

type NewProjectFormProps = {
    employees?: components['schemas']['EmployeeDTO'][];
    customers?: components['schemas']['CustomerDTO'][];
};
function NewProjectForm({ employees, customers }: NewProjectFormProps): JSX.Element {
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

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createProjectRequest),
        });
        const placeholder = await res.json();
        if (placeholder.status == 'ACTIVE' && (res.status == 200 || res.status == 201)) {
            dispatch({ type: ActionType.SET_FORM_STATUS, payload: { formStatus: FormStatus.SUCCESS } });
            router.push('/projects');
        } else {
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
                <FormControl isRequired={true}>
                    <FormLabel>Customer</FormLabel>
                    <Select onChange={handleCustomerChange} placeholder="Select customer">
                        {customers?.map((el, idx) => {
                            return (
                                <option key={idx} value={el.id}>
                                    {el.name}
                                </option>
                            );
                        })}
                    </Select>
                </FormControl>
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
                {state.formStatus == 'ERROR' ? <Text color="red.500">Something went wrong!</Text> : <Box></Box>}
            </form>
        </Flex>
    );
}

export default NewProjectForm;
