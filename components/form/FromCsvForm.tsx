import React from "react"
import {
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Select,
} from "@chakra-ui/react"
import {
    Tasks,
    Timesheets,
    TKeyOfRecord,
    TRecord,
    TSetKeyOfRecordState,
    TSetState,
} from "../modal/ImportFromCSVModal"
import { ApiGetResponse } from "@/lib/types/hooks"
import { uniq } from "lodash"
import { Task, Timesheet } from "@/lib/types/apiTypes"
import { User } from "firebase/auth"

const isKeyOfRecord = (key: unknown, record: TRecord): key is TKeyOfRecord =>
    typeof key === "string" && Object.keys(record).includes(key)

interface IFromCsvFormProps {
    user: User
    records: Array<TRecord>
    timesheets: ApiGetResponse<Timesheets>
    tasks: ApiGetResponse<Tasks>
    setDateKey: TSetKeyOfRecordState
    projectKey: TKeyOfRecord | null
    setProjectKey: TSetKeyOfRecordState
    taskKey: TKeyOfRecord | null
    setTaskKey: TSetKeyOfRecordState
    setQuantityKey: TSetKeyOfRecordState
    setDescriptionKey: TSetKeyOfRecordState
    setTimesheetsUsed: TSetState<Array<Timesheet | null>>
    setTaskUsed: TSetState<Array<Task | null>>
}

const FromCsvForm = ({
    user,
    records,
    timesheets,
    tasks,
    setDateKey,
    projectKey,
    setProjectKey,
    taskKey,
    setTaskKey,
    setQuantityKey,
    setDescriptionKey,
    setTimesheetsUsed,
    setTaskUsed,
}: IFromCsvFormProps): JSX.Element => {
    const onStateChange =
        (setter: TSetKeyOfRecordState) =>
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const { value } = event.target

            if (value.length === 0) {
                setter(null)
            }

            if (isKeyOfRecord(value, records[0])) {
                setter(value)
            }
        }

    const onProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTimesheetsUsed(records.map(() => null))
        onStateChange(setProjectKey)(event)
    }

    const onTasksChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTaskUsed(records.map(() => null))
        onStateChange(setTaskKey)(event)
    }

    const onTimesheetChange =
        (projectValue: string) =>
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const { value } = event.target
            const timesheet = timesheets.isSuccess
                ? timesheets.data.find(
                      (sheet) =>
                          sheet.project.name === value &&
                          sheet.employee.email === user.email
                  ) || null
                : null

            if (projectKey) {
                setTimesheetsUsed((sheets) =>
                    sheets.map((sheet, i) =>
                        records[i][projectKey] === projectValue
                            ? timesheet
                            : sheet
                    )
                )
            }
        }

    const onTaskChange =
        (taskValue: string) =>
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const { value } = event.target
            const task = tasks.isSuccess
                ? tasks.data.find((tsk) => tsk.name === value) || null
                : null

            if (taskKey) {
                setTaskUsed((tsks) =>
                    tsks.map((tsk, i) =>
                        records[i][taskKey] === taskValue ? task : tsk
                    )
                )
            }
        }

    const recordKeyOptions = Object.keys(records[0])

    const projectValues = projectKey
        ? uniq(records.map((rec) => rec[projectKey]))
        : []
    const taskValues = taskKey ? uniq(records.map((rec) => rec[taskKey])) : []

    const timesheetOpts = timesheets.isSuccess
        ? uniq(
              timesheets.data
                  .filter((tms) => tms.employee.email === user.email)
                  .map((tms) => tms.project.name)
          )
        : []
    const taskOpts = tasks.isSuccess
        ? uniq(tasks.data.map((tsk) => tsk.name))
        : []

    return (
        <>
            <Grid>
                <GridItem
                    style={{
                        marginBottom: "1rem",
                        marginRight: "1rem",
                        padding: "1rem",
                    }}
                >
                    <FormControl isRequired={true}>
                        <FormLabel as="label">{"Date"}</FormLabel>
                        <Select
                            placeholder={"Select date"}
                            onChange={onStateChange(setDateKey)}
                            width="11rem"
                        >
                            {recordKeyOptions.map((key) => (
                                <option key={key}>{key}</option>
                            ))}
                        </Select>
                    </FormControl>
                </GridItem>
                <GridItem
                    style={{
                        marginBottom: "1rem",
                        marginRight: "1rem",
                        backgroundColor: "rgba(130, 130, 130, 0.1)",
                        borderRadius: 6,
                        padding: "1rem",
                    }}
                >
                    <Grid
                        templateAreas={`
                            "project values"
                        `}
                    >
                        <GridItem area="project">
                            <FormControl isRequired={true}>
                                <FormLabel as="label">{"Project"}</FormLabel>
                                <Select
                                    placeholder={"Select project"}
                                    onChange={onProjectChange}
                                    width="11rem"
                                >
                                    {recordKeyOptions.map((key) => (
                                        <option key={key}>{key}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        </GridItem>
                        {projectKey && (
                            <GridItem area="values">
                                {projectValues.length > 0 &&
                                    projectValues.map((pro) => (
                                        <FormControl
                                            key={pro}
                                            isRequired={true}
                                        >
                                            <FormLabel as="label">
                                                {pro}
                                            </FormLabel>
                                            <Select
                                                placeholder={" - "}
                                                onChange={onTimesheetChange(
                                                    pro
                                                )}
                                                width="11rem"
                                            >
                                                {timesheetOpts.map((opt) => (
                                                    <option key={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ))}
                            </GridItem>
                        )}
                    </Grid>
                </GridItem>
                <GridItem
                    style={{
                        marginBottom: "1rem",
                        marginRight: "1rem",
                        backgroundColor: "rgba(130, 130, 130, 0.1)",
                        borderRadius: 6,
                        padding: "1rem",
                    }}
                >
                    <Grid
                        templateAreas={`
                            "task values"
                        `}
                    >
                        <GridItem area="task">
                            <FormControl isRequired={true}>
                                <FormLabel as="label">{"Task"}</FormLabel>
                                <Select onChange={onTasksChange} width="11rem">
                                    {recordKeyOptions.map((key) => (
                                        <option key={key}>{key}</option>
                                    ))}
                                    <option
                                        selected
                                        hidden
                                        disabled
                                        value="Task"
                                    >
                                        Select task
                                    </option>
                                </Select>
                            </FormControl>
                        </GridItem>
                        {taskKey && (
                            <GridItem area="values">
                                {taskValues.length > 0 &&
                                    taskValues.map((tsk) => (
                                        <FormControl
                                            key={tsk}
                                            isRequired={true}
                                        >
                                            <FormLabel as="label">
                                                {tsk}
                                            </FormLabel>
                                            <Select
                                                placeholder={" - "}
                                                onChange={onTaskChange(tsk)}
                                                width="11rem"
                                            >
                                                {taskOpts.map((opt) => (
                                                    <option key={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ))}
                            </GridItem>
                        )}
                    </Grid>
                </GridItem>
                <GridItem
                    style={{
                        marginBottom: "1rem",
                        marginRight: "1rem",
                        padding: "1rem",
                    }}
                >
                    <FormControl isRequired={true}>
                        <FormLabel as="label">{"Quantity"}</FormLabel>
                        <Select
                            placeholder={"Select quantity"}
                            onChange={onStateChange(setQuantityKey)}
                            width="11rem"
                        >
                            {recordKeyOptions.map((key) => (
                                <option key={key}>{key}</option>
                            ))}
                        </Select>
                    </FormControl>
                </GridItem>
                <GridItem
                    style={{
                        marginBottom: "1rem",
                        marginRight: "1rem",
                        padding: "1rem",
                    }}
                >
                    <FormControl isRequired={false}>
                        <FormLabel as="label">{"Description"}</FormLabel>
                        <Select
                            placeholder={"Select description"}
                            onChange={onStateChange(setDescriptionKey)}
                            width="11rem"
                        >
                            {recordKeyOptions.map((key) => (
                                <option key={key}>{key}</option>
                            ))}
                        </Select>
                    </FormControl>
                </GridItem>
            </Grid>
        </>
    )
}

export default FromCsvForm
