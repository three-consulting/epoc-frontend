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
import * as fetch from '@/lib/utils/fetch';
import { useSWRConfig } from 'swr';
import ErrorAlert from '@/components/common/ErrorAlert';
import { FormStatus } from './ProjectForm';
import { CustomerDTO } from '@/lib/types/dto';
import { customerEndpointURL } from '@/lib/const';

const emptyCustomer: CustomerDTO = {
    name: '',
    description: '',
};

function CustomerForm(): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [customer, setCustomer] = useState<CustomerDTO>(emptyCustomer);
    const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.IDLE);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const { mutate } = useSWRConfig();

    const submitForm = async (e: React.MouseEvent) => {
        e.preventDefault();
        setFormStatus(FormStatus.LOADING);
        try {
            await fetch.post(customerEndpointURL.toString(), customer);
            mutate(customerEndpointURL.toString());
            setFormStatus(FormStatus.SUCCESS);
            onClose();
        } catch (error) {
            setFormStatus(FormStatus.ERROR);
            setErrorMessage(`${error}`);
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
                                    setCustomer({
                                        ...customer,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Input
                                placeholder="Description"
                                onChange={(e) =>
                                    setCustomer({
                                        ...customer,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </FormControl>
                        {formStatus == 'ERROR' ? (
                            <>
                                <ErrorAlert />
                                <Box>{errorMessage}</Box>
                            </>
                        ) : null}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={submitForm}>
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

export default CustomerForm;
