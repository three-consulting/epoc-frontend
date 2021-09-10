import React from 'react';
import { Breadcrumb, BreadcrumbItem, Box, Text, VStack } from '@chakra-ui/react';
import { SettingsIcon, StarIcon } from '@chakra-ui/icons';

function NavBarMobile(): JSX.Element {
    return (
        <nav>
            <Breadcrumb padding="0.5rem" separator="">
                <Box display="flex" justifyContent="space-between">
                    <BreadcrumbItem>
                        <VStack>
                            <Text fontSize="lg" margin="0 !important" padding="0 !important">
                                ⚙️
                            </Text>
                            <Text fontSize="xs" margin="0 !important" padding="0 !important">
                                Settings
                            </Text>
                        </VStack>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <VStack>
                            <Text fontSize="lg" margin="0 !important" padding="0 !important">
                                💼
                            </Text>
                            <Text fontSize="xs" margin="0 !important" padding="0 !important">
                                Projects
                            </Text>
                        </VStack>
                    </BreadcrumbItem>
                </Box>
            </Breadcrumb>
        </nav>
    );
}

export default NavBarMobile;
