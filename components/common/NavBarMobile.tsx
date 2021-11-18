import React from 'react';
import { Breadcrumb, BreadcrumbItem, Box, Text, VStack } from '@chakra-ui/react';

function NavBarMobile(): JSX.Element {
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
                        <VStack>
                            <Text fontSize="lg" margin="0 !important" padding="0 !important">
                                🚪
                            </Text>
                            <Text fontSize="xs" margin="0 !important" padding="0 !important">
                                Sign-in
                            </Text>
                        </VStack>
                    </BreadcrumbItem>
                </Box>
            </Breadcrumb>
        </nav>
    );
}

export default NavBarMobile;
