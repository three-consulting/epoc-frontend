import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface MainProps {
    children?: ReactNode;
}

function Main({ children }: MainProps): JSX.Element {
    return (
        <Box
            display="block"
            flex="1 0 auto"
            marginLeft="auto"
            marginRight="auto"
            paddingTop="1rem"
            paddingBottom="1rem"
            width={['95vw', '75vw', '62.5vw', '50vw']}
        >
            {children}
        </Box>
    );
}

export default Main;
