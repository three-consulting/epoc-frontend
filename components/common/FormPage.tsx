import { Box, useMediaQuery } from "@chakra-ui/react"
import React from "react"
import Header from "./Header"

interface IFormPage {
    header: string
    children: JSX.Element | Array<JSX.Element | false> | false
}

const FormPage = (props: IFormPage): JSX.Element => {
    const [isLarge] = useMediaQuery("(min-width: 900px)")
    const { header, children } = props

    return (
        <Box minWidth={isLarge ? "50vw" : "100vw"}>
            {isLarge && <Header type="main">{header}</Header>}
            <Box backgroundColor="whitesmoke" minH="100vh">
                {children}
            </Box>
        </Box>
    )
}

export default FormPage
