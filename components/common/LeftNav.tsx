import React from 'react';
import { Breadcrumb, BreadcrumbItem, Text, Flex } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';

function LeftNav(): JSX.Element {
    const [session, loading] = useSession();
    return (
        <Breadcrumb padding="0.5rem" separator="" minWidth="15rem">
            <Flex flexDirection="column" justifyContent="space-between">
                <Text color="black" fontWeight="black" fontSize="xl">
                    Navigation
                </Text>
                <BreadcrumbItem
                    _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}
                    color="black"
                    fontSize="md"
                    margin="0.5rem 0rem"
                    padding="0"
                >
                    <Link href="/">
                        <a>🏠 &nbsp;Home</a>
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem
                    _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}
                    color="black"
                    fontSize="md"
                    margin="0 !important"
                    padding="0"
                >
                    <Link href="/projects">
                        <a>💼 &nbsp;Projects</a>
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem
                    _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}
                    color="black"
                    fontSize="md"
                    margin="0.5rem 0rem"
                >
                    {session?.user?.email ? (
                        <Text color="black" fontSize="md" margin="0 !important" padding="0" onClick={() => signOut()}>
                            👋 &nbsp;Sign-out
                        </Text>
                    ) : (
                        <Text
                            color="black"
                            fontSize="md"
                            margin="0 !important"
                            padding="0"
                            onClick={() => signIn('cognito')}
                        >
                            🚪 &nbsp;Sign-in
                        </Text>
                    )}
                </BreadcrumbItem>
            </Flex>
        </Breadcrumb>
    );
}

export default LeftNav;
