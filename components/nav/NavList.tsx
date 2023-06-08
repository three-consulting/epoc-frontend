import React, { useContext } from "react"
import {
    Box,
    ChakraProvider,
    Container,
    Flex,
    HStack,
    Icon,
    LinkBox,
    LinkOverlay,
    StyleConfig,
    Text,
    extendTheme,
} from "@chakra-ui/react"
import { IconType } from "react-icons"
import {
    BsBriefcase,
    BsDoorClosed,
    BsDoorOpen,
    BsFillFileTextFill,
    BsHouse,
    BsPeopleFill,
    BsPersonBadge,
} from "react-icons/bs"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import { Role } from "@/lib/types/auth"
import { MediaContext } from "@/lib/contexts/MediaContext"

interface LinkItemProps {
    name: string
    icon: IconType
    href: string
}

const hoverStyle = { bg: "gray", cursor: "pointer" }

const components: Record<string, StyleConfig> = {
    Container: {
        baseStyle: {
            _hover: hoverStyle,
            bg: "black",
            fontSize: "md",
            fontWeight: "bold",
            color: "whitesmoke",
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

const userLinkItems: LinkItemProps[] = [
    { name: "Home", icon: BsHouse, href: "/" },
    { name: "Projects", icon: BsBriefcase, href: "/project" },
    { name: "Customers", icon: BsPersonBadge, href: "/customer" },
]

const adminLinkItems: LinkItemProps[] = [
    { name: "Employees", icon: BsPeopleFill, href: "/employee" },
    { name: "Reports", icon: BsFillFileTextFill, href: "/report" },
]

const NavList = () => {
    const { isLarge } = useContext(MediaContext)

    const { user, role, signInWithGoogle, signOutAndClear } =
        useContext(AuthContext)

    const isAdmin = role === Role.ADMIN
    const isLoggedIn = user !== null

    return (
        <Flex flexDirection="column" minHeight="100vh" backgroundColor="black">
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
                adminLinkItems.map((item) =>
                    !isLarge && item.name === "Reports" ? (
                        ""
                    ) : (
                        <NavItem
                            key={item.name}
                            name={item.name}
                            icon={item.icon}
                            href={item.href}
                        />
                    )
                )}
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

export default NavList
