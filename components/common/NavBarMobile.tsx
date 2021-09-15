import React from 'react';
import { Breadcrumb, BreadcrumbItem, Box, Text, VStack } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/client';

function NavBarMobile(): JSX.Element {
    const [session, loading] = useSession();
    return (
        <nav>
            <Breadcrumb padding="0.5rem" separator="">
                <Box display="flex" justifyContent="space-between">
                    <BreadcrumbItem _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}>
                        <VStack>
                            <Text fontSize="lg" margin="0 !important" padding="0 !important">
                                ⚙️
                            </Text>
                            <Text fontSize="xs" margin="0 !important" padding="0 !important">
                                Settings
                            </Text>
                        </VStack>
                    </BreadcrumbItem>
                    <BreadcrumbItem _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}>
                        <VStack>
                            <Text fontSize="lg" margin="0 !important" padding="0 !important">
                                💼
                            </Text>
                            <Text fontSize="xs" margin="0 !important" padding="0 !important">
                                Projects
                            </Text>
                        </VStack>
                    </BreadcrumbItem>
                    <BreadcrumbItem _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}>
                        {session?.user?.email ? (
                            <VStack onClick={() => signOut()}>
                                <Text fontSize="lg" margin="0 !important" padding="0 !important">
                                    👋
                                </Text>
                                <Text fontSize="xs" margin="0 !important" padding="0 !important">
                                    Sign-out
                                </Text>
                            </VStack>
                        ) : (
                            <VStack onClick={() => signIn('cognito')}>
                                <Text fontSize="lg" margin="0 !important" padding="0 !important">
                                    🚪
                                </Text>
                                <Text fontSize="xs" margin="0 !important" padding="0 !important">
                                    Sign-in
                                </Text>
                            </VStack>
                        )}
                    </BreadcrumbItem>
                </Box>
            </Breadcrumb>
        </nav>
    );
}

export default NavBarMobile;
