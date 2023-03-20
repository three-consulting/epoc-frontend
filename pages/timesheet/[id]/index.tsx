import React, { useContext, useState } from "react"
import { Box } from "@chakra-ui/layout"
import type { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import ErrorAlert from "@/components/common/ErrorAlert"
import Loading from "@/components/common/Loading"
import TimesheetDetail from "@/components/detail/TimesheetDetail"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useTimesheetDetail } from "@/lib/hooks/useDetail"
import {
    CustomButton,
    RemoveIconButton,
    StyledButton,
} from "@/components/common/Buttons"
import FormButtons from "@/components/common/FormButtons"
import FormSection from "@/components/common/FormSection"
import FormPage from "@/components/common/FormPage"
import {
    Center,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
} from "@chakra-ui/react"
import { useUpdateTimesheets } from "@/lib/hooks/useUpdate"

interface ITimesheetDetailPage {
    timesheetId: number
}

type TimesheetStatus = "ACTIVE" | "ARCHIVED"

const TimesheetDetailPage = ({
    timesheetId,
}: ITimesheetDetailPage): JSX.Element => {
    const { user } = useContext(UserContext)

    const router = useRouter()

    const timesheetDetailResponse = useTimesheetDetail(timesheetId, user)

    const { put } = useUpdateTimesheets(user)

    const [displayArchivedModal, setDisplayArchivedModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const changeTimesheetStatus = async (
        mouseEvent: React.MouseEvent,
        status: TimesheetStatus
    ) => {
        mouseEvent.preventDefault()
        if (timesheetDetailResponse.isSuccess) {
            await put({ ...timesheetDetailResponse.data, status }, (error) =>
                setErrorMessage(`${error}`)
            )
            setDisplayArchivedModal(true)
        } else {
            setErrorMessage("Timesheet failed to load.")
        }
    }

    const onClose = () => setDisplayArchivedModal(false)
    const onArchive = (event: React.MouseEvent) =>
        changeTimesheetStatus(event, "ARCHIVED")
    const onActivate = (event: React.MouseEvent) =>
        changeTimesheetStatus(event, "ACTIVE")

    const getName = () =>
        timesheetDetailResponse.isSuccess
            ? timesheetDetailResponse.data.name
            : ""
    const getStatus = () =>
        timesheetDetailResponse.isSuccess
            ? timesheetDetailResponse.data.status
            : ""
    const getStatusString = () => {
        switch (getStatus()) {
            case "ACTIVE": {
                return "reactivated"
            }
            case "ARCHIVED": {
                return "archived"
            }
            default: {
                return ""
            }
        }
    }
    const getCustomButtonProps = () => {
        switch (getStatus()) {
            case "ACTIVE": {
                return {
                    text: "Archive",
                    colorScheme: "pink",
                    variant: "outline",
                    onClick: onArchive,
                }
            }
            case "ARCHIVED": {
                return {
                    text: "Rectivate",
                    colorScheme: "teal",
                    onClick: onActivate,
                }
            }
            default: {
                return {}
            }
        }
    }

    const getHeader = () =>
        timesheetDetailResponse.isSuccess
            ? timesheetDetailResponse.data.name
            : " - "

    const onEditClick = (url: string) => router.push(url)

    return (
        <FormPage header="Timesheet">
            <Box>
                {timesheetDetailResponse.isLoading && <Loading />}
                {errorMessage && (
                    <ErrorAlert title={errorMessage} message={errorMessage} />
                )}
                {timesheetDetailResponse.isSuccess ? (
                    <FormSection header={getHeader()}>
                        <TimesheetDetail
                            timesheet={timesheetDetailResponse.data}
                        />
                        <FormButtons>
                            <StyledButton
                                buttontype="edit"
                                onClick={() =>
                                    onEditClick(
                                        `${timesheetDetailResponse.data.id}/edit`
                                    )
                                }
                            />
                            <CustomButton {...getCustomButtonProps()} />
                        </FormButtons>
                    </FormSection>
                ) : (
                    <Box>Not found</Box>
                )}
                <Modal
                    isOpen={displayArchivedModal}
                    onClose={() => setDisplayArchivedModal(false)}
                >
                    <ModalOverlay />
                    <ModalContent borderRadius="0">
                        <ModalBody paddingY="1rem" paddingX="1rem">
                            <Flex justifyContent="end">
                                <RemoveIconButton
                                    aria-label="Close"
                                    onClick={onClose}
                                />
                            </Flex>
                            <Center paddingY="2rem">
                                {`${getName()} has been ${getStatusString()}.`}
                            </Center>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </FormPage>
    )
}

const Page: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    return id ? <TimesheetDetailPage timesheetId={Number(id)} /> : null
}

export default Page
