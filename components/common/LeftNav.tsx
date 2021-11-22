import React from 'react';
import { Breadcrumb, BreadcrumbItem, Text, Flex, Icon, HStack } from '@chakra-ui/react';
import { BsBriefcase, BsHouse, BsDoorOpen, BsDoorClosed } from 'react-icons/bs';
import { useSignIn, useSignout, useUser } from '@/lib/hooks/useAuth';
import Link from 'next/link';

function LeftNav(): JSX.Element {
    const user = useUser();
    const signIn = useSignIn();
    const signOut = useSignout();
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
                        <a>
                            <HStack>
                                <Icon as={BsHouse}></Icon>
                                <Text>Home</Text>
                            </HStack>
                        </a>
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
                        <a>
                            <HStack>
                                <Icon as={BsBriefcase}></Icon>
                                <Text>Projects</Text>
                            </HStack>
                        </a>
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem
                    _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}
                    color="black"
                    fontSize="md"
                    margin="0.5rem 0rem"
                >
                    {user ? (
                        <HStack onClick={signOut}>
                            <Icon as={BsDoorClosed}></Icon>
                            <Text>Sign-out</Text>
                        </HStack>
                    ) : (
                        <HStack onClick={signIn}>
                            <Icon as={BsDoorOpen}></Icon>
                            <Text>Sign-in</Text>
                        </HStack>
                    )}
                </BreadcrumbItem>
            </Flex>
        </Breadcrumb>
    );
}

export default LeftNav;
