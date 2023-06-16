import * as React from "react"
import {
    Box,
    Button,
    Center,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    HStack,
} from "@chakra-ui/react"
import { ChevronLeftIcon } from "@chakra-ui/icons"

type ItemDrawerProps = {
    isOpen: boolean
    onClose: () => void
    children: JSX.Element
    title?: string
}

const ItemDrawer = ({ isOpen, children, onClose, title }: ItemDrawerProps) => (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="xl">
        <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
                <HStack>
                    <Button onClick={onClose}>
                        <ChevronLeftIcon />
                    </Button>
                    <Box width={"100%"}>
                        <Center>{title}</Center>
                    </Box>
                </HStack>
            </DrawerHeader>
            <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
    </Drawer>
)

export default ItemDrawer
