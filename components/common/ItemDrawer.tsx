import * as React from "react"
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from "@chakra-ui/react"
import { ChevronLeftIcon } from "@chakra-ui/icons"

type ItemDrawerProps = {
    isOpen: boolean
    onClose: () => void
    children: JSX.Element
}

const ItemDrawer = ({ isOpen, children, onClose }: ItemDrawerProps) => (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="xl">
        <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
                <Button onClick={onClose}>
                    <ChevronLeftIcon />
                </Button>
            </DrawerHeader>
            <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
    </Drawer>
)

export default ItemDrawer
