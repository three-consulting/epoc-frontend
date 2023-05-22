import { ButtonGroup } from "@chakra-ui/react"
import React from "react"

interface IStyledButtons {
    children: JSX.Element | Array<JSX.Element>
}

const StyledButtons = (props: IStyledButtons): JSX.Element => {
    const { children } = props

    return (
        <ButtonGroup display="flex" justifyContent="end" paddingTop="1rem">
            {children}
        </ButtonGroup>
    )
}

export default StyledButtons
