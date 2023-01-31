import { Box, Flex } from "@chakra-ui/react"
import React from "react"
import ErrorAlert from "./ErrorAlert"
import Header from "./Header"

interface IFormSectionProps {
    header: string
    errorMessage?: string
    children: JSX.Element | Array<JSX.Element>
}

const FormSection = (props: IFormSectionProps): JSX.Element => {
    const { header, children, errorMessage } = props
    return (
        <Box paddingX="2rem" paddingY="1rem">
            <Header type="sub">{header}</Header>
            <Flex
                flexDirection="column"
                backgroundColor="whitesmoke"
                border="#6f6f6f solid 3px"
                paddingX="2rem"
                paddingY="1rem"
            >
                {children}
                {errorMessage && (
                    <>
                        <ErrorAlert />
                        <Box>{errorMessage}</Box>
                    </>
                )}
            </Flex>
        </Box>
    )
}

export default FormSection
