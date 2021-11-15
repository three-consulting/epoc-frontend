import {
    FormControl,
    FormLabel,
    Input,
    Modal,
    Button,
    useDisclosure,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
    ModalBody,
    ModalFooter,
    Box,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { components } from '@/lib/types/api';
import * as fetch from '@/lib/utils/fetch';
import { FormStatus } from './reducer';
import { useSWRConfig } from 'swr';
import ErrorAlert from '@/components/common/ErrorAlert';

type StateType = {
    name: string;
    description: string;
    formStatus: FormStatus;
};

function NewCustomer(): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState<StateType>({ name: '', description: '', formStatus: FormStatus.IDLE });
    const url = `${process.env.NEXT_PUBLIC_API_URL}/customer`;
    const { mutate } = useSWRConfig();

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();

        const createCustomerRequest: components['schemas']['CustomerDTO'] = {
            name: state.name,
            description: state.description,
        };
        setState({ name: state.name, description: state.description, formStatus: FormStatus.LOADING });
        try {
            await fetch.post(url, createCustomerRequest);
            mutate(url);
            setState({ name: state.name, description: state.description, formStatus: FormStatus.SUCCESS });
            onClose();
        } catch (error) {
            setState({ name: state.name, description: state.description, formStatus: FormStatus.ERROR });
        }
    };

    return (
        <>
            <Button onClick={onOpen}>Add Customer</Button>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Customer</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Customer Name</FormLabel>
                            <Input
                                placeholder="Customer Name"
                                onChange={(e) =>
                                    setState({
                                        name: e.target.value,
                                        description: state.description,
                                        formStatus: FormStatus.IDLE,
                                    })
                                }
                            />
                            {console.log(state)}
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Input
                                placeholder="Description"
                                onChange={(e) =>
                                    setState({
                                        name: state.name,
                                        description: e.target.value,
                                        formStatus: FormStatus.IDLE,
                                    })
                                }
                            />
                            {console.log(state)}
                        </FormControl>
                        {state.formStatus == 'ERROR' ? <ErrorAlert></ErrorAlert> : <Box></Box>}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button colorScheme="grey" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default NewCustomer;
