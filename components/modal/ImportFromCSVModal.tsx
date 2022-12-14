import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"
import { isError, isNull } from "lodash"
import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    GridItem,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react"
import { validateTimesheetEntryFields } from "../form/TimesheetEntryForm"
import ErrorAlert from "../common/ErrorAlert"
import { Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"
import { useUpdateTimesheetEntries } from "@/lib/hooks/useUpdate"
import { useTasks, useTimesheets } from "@/lib/hooks/useList"
import FromCsvTable from "../table/FromCsvTable"
import { parseCsv, parseQuantity } from "@/lib/utils/common"
import FileDropper from "../common/FileDropper"
import FromCsvForm from "../form/FromCsvForm"

export type Timesheets = Array<Timesheet>
export type Tasks = Array<Task>
export type TRecord = object
export type TKeyOfRecord = keyof TRecord
export type TKeyOfRecordState = TKeyOfRecord | null
export type TSetKeyOfRecordState = Dispatch<SetStateAction<TKeyOfRecordState>>
export type TSetState<T> = Dispatch<SetStateAction<T>>

interface IImportCsvDialog {
    setTimesheetEntries: Dispatch<SetStateAction<Array<TimesheetEntry>>>
}

const ImportFromCSVModal = ({
    setTimesheetEntries,
}: IImportCsvDialog): JSX.Element => {
    const { user } = useContext(UserContext)
    const { post } = useUpdateTimesheetEntries(user)

    const timesheets = useTimesheets(user)
    const tasks = useTasks(user)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [confirm, setConfirm] = useState<boolean>(false)

    const [delimiter, setDelimiter] = useState<string>(",")

    const [errorMessage, setErrorMessage] = useState<string>("")

    const [dateKey, setDateKey] = useState<TKeyOfRecordState>(null)
    const [projectKey, setProjectKey] = useState<TKeyOfRecordState>(null)
    const [taskKey, setTaskKey] = useState<TKeyOfRecordState>(null)
    const [quantityKey, setQuantityKey] = useState<TKeyOfRecordState>(null)
    const [descriptionKey, setDescriptionKey] =
        useState<TKeyOfRecordState>(null)

    const [records, setRecords] = useState<Array<TRecord>>([])

    const [timesheetsUsed, setTimesheetsUsed] = useState<
        Array<Timesheet | null>
    >([])
    const [tasksUsed, setTasksUsed] = useState<Array<Task | null>>([])

    const errorHandler = (err: Error) => setErrorMessage(err.message)

    const shouldDisable = () =>
        Boolean(
            !projectKey ||
                !tasks ||
                !dateKey ||
                !quantityKey ||
                (timesheetsUsed.length === 0 && tasksUsed.length === 0)
        )

    useEffect(() => {
        if (timesheets.isError) {
            setErrorMessage(timesheets.errorMessage)
        }
    }, [timesheets])

    useEffect(() => {
        if (tasks.isError) {
            setErrorMessage(tasks.errorMessage)
        }
    }, [tasks])

    const setters = [
        setProjectKey,
        setTaskKey,
        setDateKey,
        setQuantityKey,
        setDescriptionKey,
    ]

    const initState = () => {
        setConfirm(false)
        setters.forEach((setter) => setter(null))
        setErrorMessage("")
        setRecords([])
        setTimesheetsUsed([])
        setTasksUsed([])
    }

    const onSave = async () => {
        try {
            if (
                dateKey &&
                quantityKey &&
                timesheetsUsed.length > 0 &&
                tasksUsed.length > 0 &&
                descriptionKey
            ) {
                const newTimesheetEntries: Array<TimesheetEntry> = []
                records.forEach((record, i) => {
                    const timesheetEntry: Partial<TimesheetEntry> = {
                        date: record[dateKey],
                        quantity: parseQuantity(record[quantityKey]),
                        task: tasksUsed[i] || undefined,
                        timesheet: timesheetsUsed[i] || undefined,
                        description: descriptionKey
                            ? record[descriptionKey]
                            : undefined,
                    }

                    newTimesheetEntries.push(
                        validateTimesheetEntryFields(timesheetEntry)
                    )
                })

                const response = await post(newTimesheetEntries, errorHandler)

                if (response.isSuccess && response.data) {
                    setTimesheetEntries((entries) =>
                        entries.concat(response.data)
                    )
                }
            }
            initState()
            onClose()
        } catch (err) {
            if (isError(err)) {
                errorHandler(err)
            }
        }
    }

    const onDrop = useCallback((files: unknown) => {
        if (Array.isArray(files) && files.length > 0) {
            const reader = new FileReader()

            if (files[0]) {
                reader.onload = (load) => {
                    if (typeof load.target?.result === "string") {
                        const parsedCsv = parseCsv(
                            load.target.result,
                            errorHandler,
                            delimiter
                        )
                        setRecords(parsedCsv)
                    }
                }
                reader.readAsBinaryString(files[0])
            }
        }
    }, [])

    const onCancel = () => {
        initState()
        onClose()
    }

    const recordKeys = [
        dateKey,
        quantityKey,
        projectKey,
        taskKey,
        descriptionKey,
    ].filter((key) => !isNull(key)) as Array<TKeyOfRecord>

    return (
        <div>
            <Button onClick={onOpen}>{"Import CSV"}</Button>

            <Modal isOpen={isOpen} onClose={onCancel} size="6xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{"From CSV"}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <>
                            {confirm ? (
                                <Grid
                                    templateAreas={`
                                        "table"
                                    `}
                                >
                                    <GridItem>
                                        <FromCsvTable
                                            records={records}
                                            recordKeys={recordKeys}
                                            timesheetsUsed={timesheetsUsed}
                                            tasksUsed={tasksUsed}
                                            projectKey={projectKey}
                                            taskKey={taskKey}
                                            errorHandler={errorHandler}
                                        />
                                    </GridItem>
                                </Grid>
                            ) : (
                                <Grid
                                    templateAreas={`
                                        "delimiter"
                                        "main"
                                    `}
                                >
                                    <GridItem
                                        area={"delimiter"}
                                        style={{
                                            marginBottom: "1rem",
                                            marginRight: "1rem",
                                            borderColor: "grey",
                                            borderWidth: 1,
                                            borderRadius: 6,
                                            padding: "1rem",
                                        }}
                                    >
                                        <FormControl>
                                            <FormLabel>Delimiter</FormLabel>
                                            <Input
                                                placeholder="Insert delimiter"
                                                size="md"
                                                onChange={(event) =>
                                                    setDelimiter(
                                                        event.target.value
                                                    )
                                                }
                                                width="24rem"
                                            />
                                            <FormHelperText>
                                                {
                                                    "Insert delimiter for the CSV file. Default delimiter is comma."
                                                }
                                            </FormHelperText>
                                        </FormControl>
                                    </GridItem>
                                    <GridItem
                                        area={"main"}
                                        style={{
                                            marginBottom: "1rem",
                                            borderColor: "grey",
                                            borderWidth: 1,
                                            borderRadius: 6,
                                            padding: "1rem",
                                        }}
                                    >
                                        {records.length > 0 ? (
                                            <FromCsvForm
                                                user={user}
                                                records={records}
                                                timesheets={timesheets}
                                                tasks={tasks}
                                                setDateKey={setDateKey}
                                                projectKey={projectKey}
                                                setProjectKey={setProjectKey}
                                                taskKey={taskKey}
                                                setTaskKey={setTaskKey}
                                                setQuantityKey={setQuantityKey}
                                                setDescriptionKey={
                                                    setDescriptionKey
                                                }
                                                setTimesheetsUsed={
                                                    setTimesheetsUsed
                                                }
                                                setTaskUsed={setTasksUsed}
                                            />
                                        ) : (
                                            <FileDropper onDrop={onDrop} />
                                        )}
                                    </GridItem>
                                </Grid>
                            )}
                        </>
                        {errorMessage && errorMessage.length > 0 && (
                            <ErrorAlert message={errorMessage} />
                        )}
                    </ModalBody>

                    <ModalFooter>
                        {confirm ? (
                            <>
                                <Button
                                    mr={3}
                                    onClick={onSave}
                                    isDisabled={shouldDisable()}
                                >
                                    Save
                                </Button>
                                <Button
                                    mr={3}
                                    onClick={() => setConfirm(false)}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    mr={3}
                                    onClick={() => setConfirm(true)}
                                    isDisabled={shouldDisable()}
                                >
                                    Confirm
                                </Button>
                                <Button mr={3} onClick={onCancel}>
                                    Cancel
                                </Button>
                            </>
                        )}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ImportFromCSVModal
