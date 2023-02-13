import * as React from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@chakra-ui/react"
import { CustomButton } from "./Buttons"

interface IWarningModal {
    header: string
    content: JSX.Element | string
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
                    {buttons ?? (
                        <CustomButton onClick={onClose}>Close</CustomButton>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
)

export default WarningModal
