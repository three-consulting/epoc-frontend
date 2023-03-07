import React from "react"
import {
    Box,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    InputGroup,
} from "@chakra-ui/react"
import { User } from "firebase/auth"

interface IDateInput {
    startDate: string
    endDate: string
    setStartDate: React.Dispatch<string>
    setEndDate: React.Dispatch<string>
    user: User
}

const DateInput = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
}: IDateInput): JSX.Element => {
    const isInvalid = endDate < startDate || !endDate || !startDate

    const handleStartDateChange = (
        event: React.FormEvent<HTMLInputElement>
    ) => {
        if (
            endDate >= event.currentTarget.value &&
            endDate &&
            event.currentTarget.value
        ) {
            setStartDate(event.currentTarget.value)
        }
    }

    const handleEndDateChange = (event: React.FormEvent<HTMLInputElement>) => {
        if (
            event.currentTarget.value >= startDate &&
            event.currentTarget.value &&
            startDate
        ) {
            setEndDate(event.currentTarget.value)
        }
    }

    const isUntouched = endDate === "" || startDate === ""

    return (
        <Box paddingY="1rem">
            <FormLabel fontWeight="bold">Set time interval: </FormLabel>
            <InputGroup>
                <FormControl isInvalid={isInvalid && !isUntouched}>
                    <Input
                        type={"date"}
                        value={startDate}
                        onChange={handleStartDateChange}
                    ></Input>
                    {isInvalid ? (
                        <FormErrorMessage>Invalid dates</FormErrorMessage>
                    ) : (
                        <FormHelperText>Interval start</FormHelperText>
                    )}
                </FormControl>
                <FormControl isInvalid={isInvalid && !isUntouched}>
                    <Input
                        type={"date"}
                        value={endDate}
                        onChange={handleEndDateChange}
                    ></Input>
                    {isInvalid ? (
                        <FormErrorMessage>Invalid dates</FormErrorMessage>
                    ) : (
                        <FormHelperText>Intrerval end</FormHelperText>
                    )}
                </FormControl>
            </InputGroup>
        </Box>
    )
}

export default DateInput
