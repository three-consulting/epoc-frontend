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
    startDate: string | null
    endDate: string | null
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
    const isInvalid = !endDate || !startDate || endDate < startDate

    const handleStartDateChange = (
        event: React.FormEvent<HTMLInputElement>
    ) => {
        if (
            endDate &&
            endDate >= event.currentTarget.value &&
            event.currentTarget.value
        ) {
            setStartDate(event.currentTarget.value)
        }
    }

    const handleEndDateChange = (event: React.FormEvent<HTMLInputElement>) => {
        if (
            startDate &&
            event.currentTarget.value >= startDate &&
            event.currentTarget.value
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
                        value={startDate ?? undefined}
                        onChange={handleStartDateChange}
                    />
                    {isInvalid ? (
                        <FormErrorMessage>Invalid dates</FormErrorMessage>
                    ) : (
                        <FormHelperText>Interval start</FormHelperText>
                    )}
                </FormControl>
                <FormControl isInvalid={isInvalid && !isUntouched}>
                    <Input
                        type={"date"}
                        value={endDate ?? undefined}
                        onChange={handleEndDateChange}
                    />
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
