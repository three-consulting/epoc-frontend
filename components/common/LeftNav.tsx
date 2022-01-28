import React from 'react';
import { Text, Flex, Icon, HStack } from '@chakra-ui/react';
import { BsBriefcase, BsHouse, BsDoorOpen, BsDoorClosed } from 'react-icons/bs';
import { useSignIn, useSignout, useUser } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface LinkItemProps {
    name: string;
    icon: IconType;
    href: string;
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: BsHouse, href: '/' },
    { name: 'Projects', icon: BsBriefcase, href: '/project' },
];

const NavItem = ({ name, icon, href }: LinkItemProps) => {
    return (
        <Flex
            _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}
            color="black"
            fontSize="md"
            margin="0.5rem 0rem"
            padding="0"
        >
            <Link href={href}>
                <a>
                    <HStack>
                        <Icon as={icon} />
                        <Text>{name}</Text>
                    </HStack>
                </a>
            </Link>
        </Flex>
    );
};

function LeftNav(): JSX.Element {
    const user = useUser();
    const signIn = useSignIn();
    const signOut = useSignout();
    return (
        <Flex flexDirection="column" justifyContent="left" padding="0.5rem" pr="3.5rem">
            <Text color="black" fontWeight="black" fontSize="xl">
                Navigation
            </Text>
            {LinkItems.map((item, idx) => (
                <NavItem key={idx} name={item.name} icon={item.icon} href={item.href} />
            ))}

            <Flex
                _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }}
                color="black"
                fontSize="md"
                margin="0.5rem 0rem"
            >
                {user ? (
                    <HStack onClick={signOut}>
                        <Icon as={BsDoorClosed} />
                        <Text>Sign-out</Text>
                    </HStack>
                ) : (
                    <HStack onClick={signIn}>
                        <Icon as={BsDoorOpen} />
                        <Text>Sign-in</Text>
                    </HStack>
                )}
            </Flex>
        </Flex>
    );
}

export default LeftNav;
