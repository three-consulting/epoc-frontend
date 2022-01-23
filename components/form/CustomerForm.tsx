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
import ErrorAlert from '@/components/common/ErrorAlert';
import { CustomerDTO } from '@/lib/types/dto';
import { postCustomer } from '@/lib/utils/apiRequests';

const emptyCustomer: CustomerDTO = {
    name: '',
    description: '',
};

interface CustomerFormProps {
    refreshCustomers: () => void;
}

function CustomerForm({ refreshCustomers }: CustomerFormProps): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [customer, setCustomer] = useState<CustomerDTO>(emptyCustomer);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const submitForm = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await postCustomer(customer);
            await refreshCustomers();
            onClose();
        } catch (error) {
            setErrorMessage(error.toString());
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
                        {errorMessage ? (
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
