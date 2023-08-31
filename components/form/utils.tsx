import React, { useContext } from "react"
import {
    FormControl,
    FormErrorMessage,
    Button,
    Container,
    useToast,
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

export type Option = {
    id?: number
    name: string
}

type OptionsProps = { options: Option[] }

export const Options = ({ options }: OptionsProps) => (
    <>
        {options.map((o) => (
            <option key={o.id} value={o.id}>
                {o.name}
            </option>
        ))}
    </>
)

export const useSuccessErrorToast = (successMsg: string, errorMsg: string) => {
    const toast = useToast()

    const successToast = () =>
        toast({
            title: successMsg,
            status: "success",
            duration: 4000,
            isClosable: true,
        })

    const errorToast = () =>
        toast({
            title: errorMsg,
            status: "error",
            duration: 4000,
            isClosable: true,
        })

    return { successToast, errorToast }
}
