import React from 'react';
import { Flex } from '@chakra-ui/react';

function Header(): JSX.Element {
    return (
        <Flex
            paddingTop="0.5"
            borderBottom="1px"
            borderColor="gray.400"
            paddingBottom="0.5rem"
            textAlign="center"
            justifyContent="center"
            paddingRight="1rem"
        ></Flex>
    );
}

export default Header;
