import React from "react"
import {
    Text,
    Flex,
    Icon,
    HStack,
    extendTheme,
    ChakraProvider,
    StyleConfig,
    Container,
    LinkBox,
    LinkOverlay,
    Box,
} from "@chakra-ui/react"
import {
    BsBriefcase,
    BsHouse,
    BsDoorOpen,
    BsDoorClosed,
    BsPeopleFill,
    BsPersonBadge,
    BsFillFileTextFill,
} from "react-icons/bs"
import { IconType } from "react-icons"
import { Role } from "@/lib/types/auth"
import { User } from "firebase/auth"

interface LinkItemProps {
    name: string
    icon: IconType
    href: string
}

const userLinkItems: LinkItemProps[] = [
    { name: "Home", icon: BsHouse, href: "/" },
    { name: "Projects", icon: BsBriefcase, href: "/project" },
    { name: "Customers", icon: BsPersonBadge, href: "/customer" },
]

const adminLinkItems: LinkItemProps[] = [
    { name: "Employees", icon: BsPeopleFill, href: "/employee" },
    { name: "Reports", icon: BsFillFileTextFill, href: "/report" },
]

const primaryWhite = "whitesmoke"
const secondaryGray = "black"

const hoverStyle = { bg: "gray", cursor: "pointer" }

const components: Record<string, StyleConfig> = {
    Container: {
        baseStyle: {
            _hover: hoverStyle,
            bg: secondaryGray,
            fontSize: "md",
            fontWeight: "bold",
            color: primaryWhite,
            paddingY: "1rem",
            paddingX: "1.5rem",
        },
    },
    Icon: {
        baseStyle: {
            boxSize: "2rem",
            marginRight: "1rem",
        },
    },
}

const ThemedItem = ({ children }: { children: JSX.Element }) => (
    <ChakraProvider theme={extendTheme({ components })}>
        <Container>{children}</Container>
    </ChakraProvider>
)

const NavItem = ({ name, icon, href }: LinkItemProps) => (
    <LinkBox as="div">
        <ThemedItem>
            <LinkOverlay href={href}>
                <Flex>
                    <HStack>
                        <Icon as={icon} />
                        <Text>{name}</Text>
                    </HStack>
                </Flex>
            </LinkOverlay>
        </ThemedItem>
    </LinkBox>
)

interface ILeftNav {
    user: User | null
    role?: Role
    signInWithGoogle?: () => void
    signOutAndClear?: () => void
}

const LeftNav = ({
    user,
    role,
    signInWithGoogle,
    signOutAndClear,
}: ILeftNav): JSX.Element => {
    const isAdmin = role === Role.ADMIN
    const isLoggedIn = user !== null

    return (
        <Flex
            flexDirection="column"
            justifyContent="left"
            minHeight="100vh"
            minWidth="16rem"
            backgroundColor="black"
        >
            {isLoggedIn &&
                userLinkItems.map((item) => (
                    <NavItem
                        key={item.name}
                        name={item.name}
                        icon={item.icon}
                        href={item.href}
                    />
                ))}
            {isAdmin &&
                isLoggedIn &&
                adminLinkItems.map((item) => (
                    <NavItem
                        key={item.name}
                        name={item.name}
                        icon={item.icon}
                        href={item.href}
                    />
                ))}
            {user ? (
                <Box onClick={signOutAndClear}>
                    <ThemedItem>
                        <Flex>
                            <HStack>
                                <Icon
                                    as={BsDoorClosed}
                                    boxSize="2rem"
                                    marginRight="1rem"
                                />
                                <Text>Sign-out</Text>
                            </HStack>
                        </Flex>
                    </ThemedItem>
                </Box>
            ) : (
                <Box onClick={signInWithGoogle}>
                    <ThemedItem>
                        <Flex>
                            <HStack>
                                <Icon
                                    as={BsDoorOpen}
                                    boxSize="2rem"
                                    marginRight="1rem"
                                />
                                <Text>Sign-in</Text>
                            </HStack>
                        </Flex>
                    </ThemedItem>
                </Box>
            )}
        </Flex>
    )
}

export default LeftNav
