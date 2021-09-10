import React from 'react';
import { Breadcrumb, BreadcrumbItem, Box, Text, VStack, Flex } from '@chakra-ui/react';
import { SettingsIcon, StarIcon } from '@chakra-ui/icons';
import { signIn, useSession } from 'next-auth/client';

function LeftNav(): JSX.Element {
    const [session, loading] = useSession();
    return (
        <Breadcrumb padding="0.5rem" separator="">
            <Flex flexDirection="column" justifyContent="space-between">
                <Text color="black" fontWeight="black" fontSize="xl">
                    Navigation
                </Text>
                <BreadcrumbItem margin="0.5rem 1rem">
                    <Text color="black" fontSize="md" margin="0 !important" padding="0">
                        ⚙️ &nbsp;Settings
                    </Text>
                </BreadcrumbItem>
                <BreadcrumbItem margin="0.5rem 1rem">
                    <Text color="black" fontSize="md" margin="0 !important" padding="0">
                        💼 &nbsp;Projects
                    </Text>
                </BreadcrumbItem>
            </Flex>
        </Breadcrumb>
    );
}

export default LeftNav;
