import React from 'react';
import { Breadcrumb, BreadcrumbItem, Box, Text, VStack } from '@chakra-ui/react';
import { SettingsIcon, StarIcon } from '@chakra-ui/icons';

function NavBarMobile(): JSX.Element {
    return (
        <Breadcrumb padding="0.5rem" separator="">
            <Box display="flex" justifyContent="space-between">
                <BreadcrumbItem>
                    <VStack>
                        <SettingsIcon margin="0" padding="0" width="1.5rem" height="1.5rem" />
                        <Text fontSize="sm" margin="0 !important" padding="0">
                            Settings
                        </Text>
                    </VStack>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <VStack>
                        <StarIcon width="1.5rem" height="1.5rem" />
                        <Text fontSize="sm" margin="0 !important" padding="0">
                            Projects
                        </Text>
                    </VStack>
                </BreadcrumbItem>
            </Box>
        </Breadcrumb>
    );
}

export default NavBarMobile;
