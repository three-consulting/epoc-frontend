import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

interface AlertProps {
    title?: string;
    message?: string;
}

function ErrorAlert({
    title = 'Error!',
    message = 'An error occured. Please contact support',
}: AlertProps): JSX.Element {
    return (
        <Alert margin="0.5rem 0rem" borderRadius="0.1rem" status="error">
            <AlertIcon />
            <AlertTitle mr={2}>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}

export default ErrorAlert;
