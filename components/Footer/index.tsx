import React from 'react';
import { Box } from '@chakra-ui/react';
import NavBarMobile from '../NavBarMobile';

function Footer(): JSX.Element {
    return (
        <Box borderTop="1px" borderColor="gray.400" backgroundColor="#f1efe3">
            <NavBarMobile></NavBarMobile>
        </Box>
    );
}

export default Footer;
