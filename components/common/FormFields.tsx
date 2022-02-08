import React, { ChangeEventHandler } from "react"
import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from "@chakra-ui/react"
import styled from "@emotion/styled"
import ErrorAlert from "./ErrorAlert"

type FormInputFieldProps = {
    label: string
    placeholder: string
    isRequired?: boolean
    isInvalid?: boolean
    formErrorMessage?: string
    onChange: ChangeEventHandler<HTMLInputElement>
}

export const FormInputField = ({
    label,
    placeholder,
    isRequired,
    isInvalid,
    formErrorMessage,
    onChange,
}: FormInputFieldProps): JSX.Element => (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
        <FormLabel>{label}</FormLabel>
        <Input placeholder={placeholder} onChange={onChange} />
        {formErrorMessage && (
            <FormErrorMessage>{formErrorMessage}</FormErrorMessage>
        )}
    </FormControl>
)

type CheckBoxFieldProps = {
    label: string
    isChecked: boolean
    onChange: ChangeEventHandler<HTMLInputElement>
}

export const CheckBoxField = ({
    label,
    isChecked,
    onChange,
}: CheckBoxFieldProps): JSX.Element => (
    <FormControl py="0.5rem">
        <Flex flexDirection={"row"} alignItems={"baseline"}>
            <FormLabel>{label}</FormLabel>
            <Checkbox isChecked={isChecked} onChange={onChange} />
        </Flex>
    </FormControl>
)

type FormButtonProps = {
    onSubmit: (event: React.MouseEvent) => void
    onCancel: (() => void) | undefined
}

export const FromButtons = ({
    onSubmit,
    onCancel,
}: FormButtonProps): JSX.Element => (
    <>
        <Button colorScheme="blue" mr={3} onClick={onSubmit}>
            Submit
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
    </>
)

export const FormContainer = styled.div`
    padding: 20px;
    text-align: right;
`

type FormAlertProps = {
    errorMessage: string
}

export const FormAlerts = ({ errorMessage }: FormAlertProps): JSX.Element => (
    <>
        <ErrorAlert />
        <div>{errorMessage}</div>
    </>
)
