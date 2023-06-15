import React, { ChangeEventHandler } from "react"
import {
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from "@chakra-ui/react"
import styled from "@emotion/styled"
import ErrorAlert from "./ErrorAlert"
import StyledButtons from "./StyledButtons"
import { CustomButton, StyledButton } from "./Buttons"

type FormInputFieldProps = {
    label: string
    value: string | undefined
    placeholder: string
    isRequired?: boolean
    isInvalid?: boolean
    formErrorMessage?: string
    onChange: ChangeEventHandler<HTMLInputElement>
    testId?: string
}

export const FormInputField = ({
    label,
    value,
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
            value={value}
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

type FormButtonsProps = {
    onSubmit: (event: React.MouseEvent) => void
    onCancel: (() => void) | undefined
}

export const FormButtons = ({
    onSubmit,
    onCancel,
}: FormButtonsProps): JSX.Element => (
    <StyledButtons>
        <StyledButton
            buttontype="submit"
            onClick={onSubmit}
            data-testid={"form-button-submit"}
        />
        <StyledButton
            buttontype="cancel"
            onClick={onCancel}
            data-testid={"form-button-cancel"}
        />
    </StyledButtons>
)

type FormButtonProps = {
    buttonName: string
    buttonColor?: string
    onClick: (event: React.MouseEvent) => void
}

export const FormButton = ({
    buttonName,
    buttonColor,
    onClick,
}: FormButtonProps): JSX.Element => (
    <StyledButtons>
        <CustomButton colorScheme={buttonColor} onClick={onClick}>
            {buttonName}
        </CustomButton>
    </StyledButtons>
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
