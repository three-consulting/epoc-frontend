import React from 'react';
import { Flex } from '@chakra-ui/react';

function Header(): JSX.Element {
    return (
        <Flex
            paddingTop="1rem"
            borderBottom="1px"
            borderColor="gray.400"
            paddingBottom="1rem"
            textAlign="center"
            justifyContent="center"
            paddingRight="1rem"
            backgroundColor="white"
        />
    );
}

export default Header;
