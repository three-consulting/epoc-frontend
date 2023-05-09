import React from "react"
import {
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    IconButton,
    useDisclosure,
} from "@chakra-ui/react"
import NavList from "./NavList"
import { BsList, BsX } from "react-icons/bs"

const MenuNav = (): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleOpen = () => onOpen()
    const handleClose = () => onClose()

    return (
        <>
            <IconButton
                aria-label="Menu"
                icon={<BsList size="lg" />}
                style={{ color: "white", backgroundColor: "black" }}
                onClick={handleOpen}
                m={1}
            />
            <Drawer
                onClose={onClose}
                isOpen={isOpen}
                placement="top"
                size="full"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <Flex
                        flexDirection="column"
                        justifyContent="left"
                        minHeight="100vh"
                        minWidth="16rem"
                        backgroundColor="black"
                    >
                        <Flex justifyContent="end">
                            <IconButton
                                aria-label="Close"
                                icon={<BsX size="lg" />}
                                style={{
                                    color: "white",
                                    backgroundColor: "black",
                                }}
                                onClick={handleClose}
                                m={4}
                            />
                        </Flex>
                        <NavList />
                    </Flex>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default MenuNav
