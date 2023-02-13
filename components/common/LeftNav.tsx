import React, { useContext } from "react"
import {
    Text,
    Flex,
    Icon,
    HStack,
    extendTheme,
    ChakraProvider,
    StyleConfig,
    Container,
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
import Link from "next/link"
import { IconType } from "react-icons"
import { Role } from "@/lib/types/auth"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"

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
    <ThemedItem>
        <Link href={href}>
            <Flex>
                <a>
                    <HStack>
                        <Icon as={icon} />
                        <Text>{name}</Text>
                    </HStack>
                </a>
            </Flex>
        </Link>
    </ThemedItem>
)

function LeftNav(): JSX.Element {
    const { user, role, signInWithGoogle, signOutAndClear } =
        useContext(AuthContext)

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
            <ThemedItem>
                {user ? (
                    <Flex onClick={signOutAndClear}>
                        <HStack>
                            <Icon
                                as={BsDoorClosed}
                                boxSize="2rem"
                                marginRight="1rem"
                            />
                            <Text>Sign-out</Text>
                        </HStack>
                    </Flex>
                ) : (
                    <Flex onClick={signInWithGoogle}>
                        <HStack>
                            <Icon
                                as={BsDoorOpen}
                                boxSize="2rem"
                                marginRight="1rem"
                            />
                            <Text>Sign-in</Text>
                        </HStack>
                    </Flex>
                )}
            </ThemedItem>
        </Flex>
    )
}

export default LeftNav
