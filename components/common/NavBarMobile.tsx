import React from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    Box,
    Text,
    VStack,
    Icon,
} from "@chakra-ui/react"
import { BsBriefcase, BsHouse, BsDoorOpen, BsDoorClosed } from "react-icons/bs"
import useFirebaseAuth from "@/lib/hooks/useFirebaseAuth"

function NavBarMobile(): JSX.Element {
    const { user, signInWithGoogle, signOutAndClear } = useFirebaseAuth()
    return (
        <nav>
            <Breadcrumb padding="0.5rem" separator="">
                <Box display="flex" justifyContent="space-between">
                    <BreadcrumbItem
                        _hover={{
                            backgroundColor: "gray.200",
                            cursor: "pointer",
                        }}
                    >
                        <VStack>
                            <Icon as={BsHouse} />
                            <Text
                                fontSize="xs"
                                margin="0 !important"
                                padding="0 !important"
                            >
                                Settings
                            </Text>
                        </VStack>
                    </BreadcrumbItem>
                    <BreadcrumbItem
                        _hover={{
                            backgroundColor: "gray.200",
                            cursor: "pointer",
                        }}
                    >
                        <VStack>
                            <Icon as={BsBriefcase} />
                            <Text
                                fontSize="xs"
                                margin="0 !important"
                                padding="0 !important"
                            >
                                Projects
                            </Text>
                        </VStack>
                    </BreadcrumbItem>
                    <BreadcrumbItem
                        _hover={{
                            backgroundColor: "gray.200",
                            cursor: "pointer",
                        }}
                    >
                        {user ? (
                            <VStack onClick={signOutAndClear}>
                                <Icon as={BsDoorClosed} />
                                <Text
                                    fontSize="xs"
                                    margin="0 !important"
                                    padding="0 !important"
                                >
                                    Sign-out
                                </Text>
                            </VStack>
                        ) : (
                            <VStack onClick={signInWithGoogle}>
                                <Icon as={BsDoorOpen} />
                                <Text
                                    fontSize="xs"
                                    margin="0 !important"
                                    padding="0 !important"
                                >
                                    Sign-in
                                </Text>
                            </VStack>
                        )}
                    </BreadcrumbItem>
                </Box>
            </Breadcrumb>
        </nav>
    )
}

export default NavBarMobile
