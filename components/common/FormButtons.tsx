import { ButtonGroup } from "@chakra-ui/react"
import React from "react"

interface IFormButtons {
    children: JSX.Element | Array<JSX.Element>
}

const FormButtons = (props: IFormButtons): JSX.Element => {
    const { children } = props

    return (
        <ButtonGroup display="flex" justifyContent="end" paddingTop="1rem">
            {children}
        </ButtonGroup>
    )
}

export default FormButtons
