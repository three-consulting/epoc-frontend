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
import { Customer } from '@/lib/types/apiTypes';
import { useUpdateCustomers } from '@/lib/hooks/useCustomers';

type CustomerFields = Partial<Customer>;

const validateCustomerFields = (fields: CustomerFields): Customer => {
    const { name } = fields;
    if (name) {
        return { ...fields, name };
    } else {
        throw 'Invalid customer form: missing required fields';
    }
};

function CreateCustomerForm(): JSX.Element {
    const [customerFields, setCustomerFields] = useState<CustomerFields>({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { postCustomer } = useUpdateCustomers();

    const submitForm = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await postCustomer(validateCustomerFields(customerFields));
            onClose();
        } catch (error) {
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
                                    setCustomerFields({
                                        ...customerFields,
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
                                    setCustomerFields({
                                        ...customerFields,
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

export default CreateCustomerForm;
