import { Box, useMediaQuery } from "@chakra-ui/react"
import React from "react"
import Header from "./Header"

interface IFormPage {
    header: string
    children: JSX.Element | Array<JSX.Element | false> | false
}

const FormPage = (props: IFormPage): JSX.Element => {
    const { header, children } = props
    const [isLarge] = useMediaQuery("(min-width: 800px)")

    return (
        <Box>
            {isLarge && <Header type="main">{header}</Header>}
            <Box backgroundColor="whitesmoke" minH="100vh">
                {children}
            </Box>
        </Box>
    )
}

export default FormPage
