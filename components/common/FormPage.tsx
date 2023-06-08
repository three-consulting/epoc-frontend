import { MediaContext } from "@/lib/contexts/MediaContext"
import { Box } from "@chakra-ui/react"
import React, { useContext } from "react"
import Header from "./Header"

interface IFormPage {
    header: string
    children: JSX.Element | Array<JSX.Element | false> | false
}

const FormPage = (props: IFormPage): JSX.Element => {
    const { isLarge } = useContext(MediaContext)
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
