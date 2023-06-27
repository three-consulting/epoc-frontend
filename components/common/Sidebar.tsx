import React, { ReactNode, useContext } from "react"
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    useColorModeValue,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
} from "@chakra-ui/react"
import { FiMenu } from "react-icons/fi"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import Link from "next/link"

interface LinkItemProps {
    name: string
    href: string
}
const LinkItems: LinkItemProps[] = [
    { name: "Home", href: "/" },
    { name: "Organization", href: "/organization" },
    { name: "Reports", href: "/report" },
]

export default function Sidebar({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: "none", xl: "block" }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <MobileNav display={{ base: "flex", xl: "none" }} onOpen={onOpen} />
            <Box ml={{ base: 0, xl: 60 }} p="0">
                {children}
            </Box>
        </Box>
    )
}

interface SidebarProps extends BoxProps {
    onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const { signOutAndClear } = useContext(AuthContext)
    return (
        <Box
            bg={useColorModeValue("white", "gray.900")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", xl: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex
                h="20"
                alignItems="center"
                mx="8"
                justifyContent="space-between"
            >
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Epoc
                </Text>
                <CloseButton
                    display={{ base: "flex", md: "none" }}
                    onClick={onClose}
                />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} href={link.href} onClick={onClose}>
                    <>{link.name}</>
                </NavItem>
            ))}
            <NavItem mt={"8"} onClick={signOutAndClear} href={"#"} red={true}>
                <>Log out</>
            </NavItem>
        </Box>
    )
}

interface NavItemProps extends FlexProps {
    children: JSX.Element
    href: string
    red?: boolean
}

const NavItem = ({ children, href, red, ...rest }: NavItemProps) => (
    <Link href={href} style={{ textDecoration: "none" }}>
        <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
                bg: red ? "red.300" : "cyan.400",
                color: "white",
            }}
            {...rest}
        >
            {children}
        </Flex>
    </Link>
)

interface MobileProps extends FlexProps {
    onOpen: () => void
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => (
    <Flex
        ml={{ base: 0, xl: 60 }}
        px={{ base: 4, md: 24 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue("white", "gray.900")}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        justifyContent="flex-start"
        {...rest}
    >
        <IconButton
            variant="outline"
            onClick={onOpen}
            aria-label="open menu"
            icon={<FiMenu />}
        />

        <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
            Epoc
        </Text>
    </Flex>
)
