import { Text } from '@chakra-ui/layout';
import {
    Modal,
    Button,
    useDisclosure,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalContent,
    ModalBody,
    ModalFooter,
} from '@chakra-ui/react';
import React from 'react';

function NewCustomer(): JSX.Element {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button colorScheme="blue" onClick={onOpen}>
                Add Project
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay></ModalOverlay>
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton></ModalCloseButton>
                    <ModalBody>
                        <Text>Foo</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default NewCustomer;
