import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface MainProps {
    children?: ReactNode;
}

function Main({ children }: MainProps): JSX.Element {
    return (
        <Box display="block" marginLeft="auto" marginRight="auto" width={['95vw', '75vw', '62.5vw', '50vw']}>
            {children}
        </Box>
    );
}

export default Main;
