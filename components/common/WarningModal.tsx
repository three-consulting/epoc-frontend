import * as React from "react"
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react"

interface IWarningModal {
    header: string
    content: JSX.Element
    buttons?: JSX.Element
    isOpen: boolean
    onClose: () => void
}

const WarningModal = ({
    header,
    content,
    buttons,
    isOpen,
    onClose,
}: IWarningModal): JSX.Element => (
    <>
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{header}</ModalHeader>
                <ModalBody>{content}</ModalBody>
                <ModalFooter>
                    {buttons ?? <Button onClick={onClose}>Close</Button>}
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
)

export default WarningModal
