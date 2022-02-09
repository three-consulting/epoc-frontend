import React, { ChangeEventHandler } from "react"
import {
    Button,
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
    testId?: string
}

export const FormInputField = ({
    label,
    placeholder,
    isRequired,
    isInvalid,
    formErrorMessage,
    onChange,
    testId,
}: FormInputFieldProps): JSX.Element => (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
        <FormLabel>{label}</FormLabel>
        <Input
            placeholder={placeholder}
            onChange={onChange}
            data-testid={testId}
        />
        {formErrorMessage && (
            <FormErrorMessage>{formErrorMessage}</FormErrorMessage>
        )}
    </FormControl>
)

type CheckBoxFieldProps = {
    label: string
    isChecked: boolean
    onChange: ChangeEventHandler<HTMLInputElement>
    testId?: string
}

export const CheckBoxField = ({
    label,
    isChecked,
    onChange,
    testId,
}: CheckBoxFieldProps): JSX.Element => (
    <FormControl py="0.5rem">
        <Flex flexDirection={"row"} alignItems={"baseline"}>
            <FormLabel>{label}</FormLabel>
            <input
                type={"checkbox"}
                checked={isChecked}
                onChange={onChange}
                data-testid={testId}
            />
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
        <Button
            colorScheme="blue"
            mr={3}
            onClick={onSubmit}
            data-testid={"form-button-submit"}
        >
            Submit
        </Button>
        <Button onClick={onCancel} data-testid={"form-button-cancel"}>
            Cancel
        </Button>
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
