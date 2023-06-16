import React, { useContext } from "react"
import {
    FormControl,
    FormErrorMessage,
    Button,
    Container,
} from "@chakra-ui/react"
import { FieldErrors, FieldValues } from "react-hook-form"
import _ from "lodash"
import { MediaContext } from "@/lib/contexts/MediaContext"

type FormFieldProps = {
    field: string
    errors: FieldErrors<FieldValues>
    children: JSX.Element | JSX.Element[]
}

export const FormField = ({ field, errors, children }: FormFieldProps) => (
    <FormControl
        isInvalid={Boolean(_.get(errors, field))}
        height="100px"
        mb={4}
    >
        {children}
        <FormErrorMessage>
            {Boolean(_.get(errors, field)) &&
                (_.get(errors, field)?.message as string)}
        </FormErrorMessage>
    </FormControl>
)

type SubmitButtonProps = {
    disabled: boolean
    isLoading?: boolean
}

export const SubmitButton = ({ disabled, isLoading }: SubmitButtonProps) => (
    <Button
        mt={4}
        color="white"
        background="green.300"
        type="submit"
        isDisabled={disabled}
        isLoading={isLoading}
    >
        Submit
    </Button>
)

type FormContainerProps = { children: JSX.Element | JSX.Element[] }

export const FormContainer = ({ children }: FormContainerProps) => {
    const { isLarge } = useContext(MediaContext)
    return <Container pt={isLarge ? 16 : 4}>{children}</Container>
}

export const toggleArchived = (
    b: boolean,
    setValue: (s: string, t: string) => void
) => {
    setValue("status", b ? "ARCHIVED" : "ACTIVE")
}
