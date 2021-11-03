import { Button, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import reducer, { init, initialState, ActionType, FormStatus } from './reducer';
import { Flex } from '@chakra-ui/layout';
import React, { useReducer } from 'react';
import { components } from '@/lib/types/api';

type NewProjectFormProps = {
    employees?: components['schemas']['EmployeeDTO'][];
    customers?: components['schemas']['CustomerDTO'][];
};
function NewProjectForm({ employees, customers }: NewProjectFormProps): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    /*
    const handleCustomerChange = (e: React.SyntheticEvent) => {
        e.preventDefault();
    };
    */
    return (
        <Flex
            flexDirection="column"
            backgroundColor="white"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0.2rem"
            padding="1rem 1rem"
        >
            <form>
                <FormControl>
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
                <FormControl>
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
                <FormControl>
                    <FormLabel>Customer</FormLabel>
                    <Select placeholder="Select customer">
                        {customers?.map((el, idx) => {
                            return (
                                <option key={idx} value={el.id}>
                                    {el.name}
                                </option>
                            );
                        })}
                    </Select>
                </FormControl>
                <br />
                <Button colorScheme="blue" type="submit">
                    Submit
                </Button>
            </form>
        </Flex>
    );
}

export default NewProjectForm;
