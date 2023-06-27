/* eslint-disable no-extra-parens */
import React, { useContext, useEffect, useState } from "react"
import type { NextPage } from "next"
import Loading from "@/components/common/Loading"
import { useTimesheetEntries, useTimesheets } from "@/lib/hooks/useList"
import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Divider,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    HStack,
    Input,
    Select,
} from "@chakra-ui/react"
import { Task, Timesheet, TimesheetEntry } from "@/lib/types/apiTypes"
import _ from "lodash"
import {
    FieldValues,
    useForm,
    UseFormGetValues,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form"
import {
    downloadFile,
    functionCompose,
    yyyymmddToDateTime,
} from "@/lib/utils/common"
import { DateTime } from "luxon"
import { MediaContext } from "@/lib/contexts/MediaContext"
import { WarningTwoIcon } from "@chakra-ui/icons"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import { getText } from "@/lib/utils/fetch"
import { User } from "firebase/auth"
import { AuthContext } from "@/lib/contexts/FirebaseAuthContext"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { useRouter } from "next/router"

export const handleCsvExportClick = async (
    user: User,
    params?: {
        email?: string
        projectId?: string
        customerId?: string
        taskId?: string
        startDate?: string
        endDate?: string
    }
) => {
    const res = await getText(
        `${NEXT_PUBLIC_API_URL}/timesheet-entry/csv-export`,
        user,
        params
    )
    const blob = new Blob([res], { type: "text/csv;charset=utf-8" })
    const fileName = `entries_${params?.startDate}_${params?.endDate}.csv`
    downloadFile(blob, fileName)
}

const formatDate = (date?: unknown) =>
    typeof date === "string" ? date.split("-").reverse().join(".") : ""

const createEmployeeHoursPages = (
    allEntries: Array<Array<TimesheetEntry>>,
    document: jsPDF,
    startingDate: string,
    endingDate: string,
    startX: number
) => {
    allEntries.forEach((entries: Array<TimesheetEntry>, index) => {
        const employee = entries[0]?.timesheet?.employee

        if (index !== 0) {
            document.addPage()
        }
        const totalHours =
            entries.length > 0
                ? entries.reduce((prv: number, crr) => prv + crr.quantity, 0)
                : 0

        document.setFontSize(24)
        document.text("Time Report", startX, 14)

        document.setFontSize(12)
        document.text(
            `Timeframe: ${formatDate(startingDate)} - ${formatDate(
                endingDate
            )}`,
            startX,
            24
        )
        document.text(
            `Employee: ${employee?.firstName ?? "-"} ${
                employee?.lastName ?? "-"
            }`,
            startX,
            29
        )
        document.text(`Email: ${employee?.email ?? "-"}`, startX, 34)
        document.text(`Total hours: ${totalHours}`, startX, 39)

        const headers = [
            "Date",
            "Customer",
            "Project",
            "Task",
            "Hours",
            "Description",
        ]

        const data =
            entries.length > 0
                ? entries.map((entry) => [
                      entry.date ? formatDate(entry.date) : "-",
                      entry.timesheet.project.customer.name ?? "-",
                      entry.timesheet.project.name ?? "-",
                      entry.task.name ?? "-",
                      entry.quantity.toString() ?? "-",
                      entry.description ?? "-",
                  ])
                : [headers.map(() => "-")]

        autoTable(document, {
            head: [headers],
            body: data,
            startY: 50,
        })
    })
}

const initializeTitlePage = (
    startDate: string,
    endDate: string,
    document: jsPDF
) => {
    document.setFontSize(24)
    document.text("Time Report", 14, 25)
    document.setFontSize(12)
    document.text(
        `Timeframe: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        14,
        35
    )
}

const createTitlePage = (
    allEntries: Array<Array<TimesheetEntry>>,
    document: jsPDF,
    startingDate: string,
    endingDate: string
) => {
    initializeTitlePage(startingDate, endingDate, document)

    const groupedHours = _.groupBy(
        allEntries.flat().map((x) => ({
            name: `${x.timesheet.employee.firstName} ${x.timesheet.employee.lastName}`,
            quantity: x.quantity as number,
        })),
        (x) => x.name
    )
    const allEmployeeHours = _.mapValues(groupedHours, (x) =>
        _.sumBy(x, "quantity")
    )
    const totalHours = _.sum(Object.values(allEmployeeHours))
    document.text(`Total hours: ${totalHours}`, 14, 40)
    autoTable(document, {
        head: [["Name", "Hours"]],
        body: _.toPairs(allEmployeeHours),
        startY: 60,
    })
    document.addPage()
}

const handlePdfExportClick = (
    timesheetEntries: Array<TimesheetEntry>,
    startDate: string,
    endDate: string
) => {
    const JsPDF = jsPDF
    const doc = new JsPDF()
    const startX = 14

    const groupedEntries = _.toArray(
        _.groupBy(timesheetEntries, (entry) => entry.timesheet.employee.id)
    )

    if (groupedEntries.length > 1) {
        createTitlePage(groupedEntries, doc, startDate, endDate)
    }

    createEmployeeHoursPages(groupedEntries, doc, startDate, endDate, startX)

    doc.save(`timereport_${formatDate(startDate)}-${formatDate(endDate)}.pdf`)
}

const NoHours = () => (
    <Box textAlign="center" py={10} px={6} mt={16}>
        <WarningTwoIcon boxSize={"50px"} color={"orange.300"} />
        <Heading as="h2" size="xl" mt={6} mb={2}>
            No hours for these filters
        </Heading>
    </Box>
)

type FiltersProps = {
    timesheets: Timesheet[]
    entries: TimesheetEntry[]
    register: UseFormRegister<FieldValues>
    getValues: UseFormGetValues<FieldValues>
    setValue: UseFormSetValue<FieldValues>
    watch: UseFormWatch<FieldValues>
    setEntryFilter: React.Dispatch<
        React.SetStateAction<(es: TimesheetEntry[]) => TimesheetEntry[]>
    >
}

const Filters = ({
    timesheets,
    entries,
    register,
    getValues,
    setValue,
    watch,
    setEntryFilter,
}: FiltersProps) => {
    watch()
    const { employee, customer, project, task, startDate, endDate } =
        getValues()

    const firstOfMonth = DateTime.fromJSDate(new Date())
        .startOf("month")
        .toFormat("yyyy-MM-dd")
    const lastOfMonth = DateTime.fromJSDate(new Date())
        .endOf("month")
        .toFormat("yyyy-MM-dd")

    useEffect(() => {
        setValue("startDate", firstOfMonth)
    }, [])

    useEffect(() => {
        setValue("endDate", lastOfMonth)
    }, [])

    const intervalStart =
        !_.isEmpty(startDate) && yyyymmddToDateTime(startDate).isValid
            ? yyyymmddToDateTime(startDate)
            : undefined
    const intervalEnd =
        !_.isEmpty(endDate) && yyyymmddToDateTime(endDate).isValid
            ? yyyymmddToDateTime(endDate)
            : undefined

    const employeeOptions = _.sortBy(
        _.uniqBy(
            timesheets.map((t) => t.employee),
            "id"
        ),
        ["firstName", "lastName"]
    )

    const customerOptions = _.sortBy(
        _.uniqBy(
            timesheets
                .filter((t) =>
                    _.isEmpty(employee)
                        ? true
                        : t.employee.id === Number(employee)
                )
                .map((t) => t.project.customer),
            "id"
        ),
        "name"
    )

    const projectOptions = _.sortBy(
        _.uniqBy(
            timesheets
                .filter((t) =>
                    _.isEmpty(employee)
                        ? true
                        : t.employee.id === Number(employee)
                )
                .filter((t) =>
                    _.isEmpty(customer)
                        ? true
                        : t.project.customer.id === Number(customer)
                )
                .map((t) => t.project),
            "id"
        ),
        "name"
    )

    const taskOptions = _.sortBy(
        _.uniqBy(
            entries
                .filter((entry) =>
                    _.isEmpty(employee)
                        ? true
                        : entry.timesheet.employee.id === Number(employee)
                )
                .map((entry) => entry.task)
                .filter((tsk) =>
                    _.isEmpty(customer)
                        ? true
                        : tsk.project.customer.id === Number(customer)
                )
                .filter((tsk) =>
                    _.isEmpty(project)
                        ? true
                        : tsk.project.id === Number(project)
                ),
            "id"
        ),
        "name"
    )

    useEffect(() => {
        if (
            !_.isEmpty(customer) &&
            !customerOptions.map(({ id }) => id).includes(Number(customer))
        ) {
            setValue("customer", undefined)
        }
    }, [JSON.stringify(employee)])

    useEffect(() => {
        if (
            !_.isEmpty(project) &&
            !projectOptions.map(({ id }) => id).includes(Number(project))
        ) {
            setValue("project", undefined)
        }
    }, [JSON.stringify(employee), JSON.stringify(customer)])

    useEffect(() => {
        if (
            !_.isEmpty(task) &&
            !taskOptions.map(({ id }) => id).includes(Number(task))
        ) {
            setValue("task", undefined)
        }
    }, [
        JSON.stringify(employee),
        JSON.stringify(customer),
        JSON.stringify(project),
    ])

    const employeeFilter = (es: TimesheetEntry[]) =>
        _.isEmpty(employee)
            ? es
            : es.filter((e) => e.timesheet.employee.id === Number(employee))

    const customerFilter = (es: TimesheetEntry[]) =>
        _.isEmpty(customer)
            ? es
            : es.filter(
                  (e) => e.timesheet.project.customer.id === Number(customer)
              )

    const projectFilter = (es: TimesheetEntry[]) =>
        _.isEmpty(project)
            ? es
            : es.filter((e) => e.timesheet.project.id === Number(project))

    const taskFilter = (es: TimesheetEntry[]) =>
        _.isEmpty(task) ? es : es.filter((e) => e.task.id === Number(task))

    const startDateFilter = (es: TimesheetEntry[]) =>
        _.isEmpty(intervalStart)
            ? es
            : es.filter((e) => yyyymmddToDateTime(e.date) >= intervalStart)

    const endDateFilter = (es: TimesheetEntry[]) =>
        _.isEmpty(intervalEnd)
            ? es
            : es?.filter((e) => yyyymmddToDateTime(e.date) <= intervalEnd)

    useEffect(
        () =>
            setEntryFilter(() =>
                functionCompose([
                    employeeFilter,
                    customerFilter,
                    projectFilter,
                    taskFilter,
                    startDateFilter,
                    endDateFilter,
                ])
            ),
        [
            JSON.stringify(employee),
            JSON.stringify(customer),
            JSON.stringify(project),
            JSON.stringify(task),
            intervalStart?.toISO(),
            intervalEnd?.toISO(),
        ]
    )

    return (
        <>
            <Box>
                <FormLabel>Employee</FormLabel>
                <Select
                    {...register("employee")}
                    placeholder={" "}
                    maxW={"400px"}
                >
                    {employeeOptions.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.firstName} {e.lastName}
                        </option>
                    ))}
                </Select>
            </Box>
            <Box>
                <FormLabel>Customer</FormLabel>
                <Select
                    {...register("customer")}
                    placeholder={" "}
                    maxW={"400px"}
                >
                    {customerOptions.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </Select>
            </Box>
            <Box>
                <FormLabel>Project</FormLabel>
                <Select
                    {...register("project")}
                    placeholder={" "}
                    maxW={"400px"}
                >
                    {projectOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </Select>
            </Box>
            <Box>
                <FormLabel>Task</FormLabel>
                <Select {...register("task")} placeholder={" "} maxW={"400px"}>
                    {taskOptions.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </Select>
            </Box>
            <Box>
                <FormLabel>Interval start</FormLabel>
                <Input
                    {...register("startDate")}
                    type={"date"}
                    maxW={"400px"}
                />
            </Box>
            <Box>
                <FormLabel>Interval end</FormLabel>
                <Input {...register("endDate")} type={"date"} maxW={"400px"} />
            </Box>
        </>
    )
}

type TaskHoursGridProps = { items: { task: Task; hours: number }[] }

const TaskHoursGrid = ({ items }: TaskHoursGridProps) => (
    <Grid templateColumns="repeat(2, 4fr)" gap={2}>
        {items.map(({ task, hours }, i) => (
            <React.Fragment key={i}>
                <GridItem>{task.name}</GridItem>
                <GridItem>{hours}h</GridItem>
            </React.Fragment>
        ))}
    </Grid>
)

const hoursSum = (es: TimesheetEntry[]) =>
    _.sum(es.map(({ quantity }) => quantity))

const TotalHours = ({ entries }: HoursByCustomerProps) => {
    const total = hoursSum(entries)
    const income = _.sum(
        entries.map(({ quantity, timesheet }) => quantity * timesheet.rate)
    )

    return (
        <Box height="100px" overflow="scroll">
            <Grid templateColumns="repeat(2, 4fr)" gap={2}>
                <GridItem>Grand total</GridItem>
                <GridItem>{total}h</GridItem>
                <GridItem>Projected income</GridItem>
                <GridItem>{income}€</GridItem>
            </Grid>
        </Box>
    )
}

const HoursByEmployee = ({ entries }: HoursByCustomerProps) => {
    const hoursByEmployee = _.values(
        _.groupBy(entries, "timesheet.employee.id")
    ).map((es) => {
        const { employee } = es[0].timesheet
        return {
            name: `${employee.firstName} ${employee.lastName}`,
            hours: hoursSum(es),
        }
    })

    return (
        <Box height="150px" overflow="scroll">
            <Grid templateColumns="repeat(2, 4fr)" gap={2}>
                {hoursByEmployee.map(({ name, hours }, k) => (
                    <React.Fragment key={k}>
                        <GridItem>{name}</GridItem>
                        <GridItem>{hours}h</GridItem>
                    </React.Fragment>
                ))}
            </Grid>
        </Box>
    )
}

type HoursByCustomerProps = {
    entries: TimesheetEntry[]
}

const HoursByCustomer = ({ entries }: HoursByCustomerProps) => {
    const hoursByCustomer = _.values(
        _.groupBy(entries, "timesheet.project.customer.id")
    ).map((customerEntries) => {
        const { customer } = customerEntries[0].timesheet.project
        return {
            customer,
            hours: hoursSum(customerEntries),
            projectHours: _.values(
                _.groupBy(customerEntries, "timesheet.project.id")
            ).map((projectEntries) => {
                const { project } = projectEntries[0].timesheet
                return {
                    project,
                    hours: hoursSum(projectEntries),
                    taskHours: _.values(
                        _.groupBy(projectEntries, "task.id")
                    ).map((taskEntries) => {
                        const [{ task }] = taskEntries
                        return { task, hours: hoursSum(taskEntries) }
                    }),
                }
            }),
        }
    })

    return entries.length > 0 ? (
        <>
            <Box>
                <Accordion allowMultiple>
                    {hoursByCustomer.map(
                        (
                            { customer, hours: customerTotal, projectHours },
                            i
                        ) => (
                            <AccordionItem key={i}>
                                <AccordionButton pb={8}>
                                    <Box>
                                        <Heading size="md">
                                            {customer.name}
                                        </Heading>
                                    </Box>
                                    <Box ml={"auto"}>
                                        <Heading size="md">
                                            {customerTotal}h
                                        </Heading>
                                    </Box>
                                </AccordionButton>
                                <AccordionPanel>
                                    <Accordion allowMultiple>
                                        {projectHours.map(
                                            (
                                                {
                                                    project,
                                                    hours: projectTotal,
                                                    taskHours,
                                                },
                                                j
                                            ) => (
                                                <AccordionItem key={j}>
                                                    <AccordionButton pb={4}>
                                                        <Box>
                                                            <Heading size="sm">
                                                                {project.name}
                                                            </Heading>
                                                        </Box>
                                                        <Box ml={"auto"}>
                                                            <Heading size="sm">
                                                                {projectTotal}h
                                                            </Heading>
                                                        </Box>
                                                    </AccordionButton>
                                                    <AccordionPanel>
                                                        <TaskHoursGrid
                                                            items={taskHours}
                                                        />
                                                    </AccordionPanel>
                                                </AccordionItem>
                                            )
                                        )}
                                    </Accordion>
                                </AccordionPanel>
                            </AccordionItem>
                        )
                    )}
                </Accordion>
            </Box>
        </>
    ) : (
        <NoHours />
    )
}

type ExportButtonsProps = {
    getValues: UseFormGetValues<FieldValues>
    entries: TimesheetEntry[]
}

const ExportButtons = ({ getValues, entries }: ExportButtonsProps) => {
    const { user } = useContext(AuthContext)
    const { employee, project, customer, task, startDate, endDate } =
        getValues()
    const email =
        !_.isUndefined(employee) &&
        entries.find((e) => e.timesheet.employee.id === Number(employee))
            ?.timesheet.employee.email

    const params = {
        ...(email ? { email } : {}),
        ...(project ? { projectId: project } : {}),
        ...(customer ? { customerId: customer } : {}),
        ...(task ? { taskId: task } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
    }

    const csv = () => handleCsvExportClick(user, params)
    const pdf = () => handlePdfExportClick(entries, startDate, endDate)
    return (
        <HStack spacing={"24px"}>
            <Button background="blue.200" onClick={csv}>
                Export .csv
            </Button>
            <Button background="blue.200" onClick={pdf}>
                Export .pdf
            </Button>
        </HStack>
    )
}

const Report: NextPage = () => {
    const { isLarge } = useContext(MediaContext)
    const { role } = useContext(AuthContext)
    const router = useRouter()

    if (role !== "ADMIN") {
        router.push("/404")
    }

    const startDate = "0000-01-01"
    const endDate = "9999-01-01"

    const timesheetsResponse = useTimesheets()
    const timesheetEntriesResponse = useTimesheetEntries(startDate, endDate)

    const { register, getValues, setValue, watch } = useForm({
        mode: "onBlur",
    })

    // eslint-disable-next-line func-call-spacing
    const [entryFilter, setEntryFilter] = useState<
        (es: TimesheetEntry[]) => TimesheetEntry[]
    >(() => (x: TimesheetEntry[]) => x)

    const entries = timesheetEntriesResponse.isSuccess
        ? entryFilter(timesheetEntriesResponse.data)
        : []

    const filters = (
        <Filters
            timesheets={
                timesheetsResponse.isSuccess ? timesheetsResponse.data : []
            }
            entries={
                timesheetEntriesResponse.isSuccess
                    ? timesheetEntriesResponse.data
                    : []
            }
            register={register}
            getValues={getValues}
            setValue={setValue}
            watch={watch}
            setEntryFilter={setEntryFilter}
        />
    )

    const hoursByCustomer =
        timesheetsResponse.isSuccess && timesheetEntriesResponse.isSuccess ? (
            <HoursByCustomer entries={entries} />
        ) : (
            <Loading />
        )

    const hoursByEmployee =
        timesheetsResponse.isSuccess && timesheetEntriesResponse.isSuccess ? (
            <HoursByEmployee entries={entries} />
        ) : null

    const totalHours =
        timesheetsResponse.isSuccess && timesheetEntriesResponse.isSuccess ? (
            <TotalHours entries={entries} />
        ) : null

    return (
        <>
            <Heading as="h1" mb={16}>
                Reports
            </Heading>
            {isLarge ? (
                <>
                    <Box width={"30%"} height={"100%"} float="left" mr={32}>
                        {filters}
                        {entries.length > 0 && (
                            <>
                                <Divider mt={8} mb={8} />
                                <Box>
                                    <Heading mb={8} size={"md"}>
                                        Total hours
                                    </Heading>
                                    {hoursByEmployee}
                                    {totalHours}
                                    <ExportButtons
                                        getValues={getValues}
                                        entries={entries}
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                    <Box width={"50%"} height={"100%"} float="left">
                        {hoursByCustomer}
                    </Box>
                </>
            ) : (
                <>
                    <Box mb={8}>{filters}</Box>
                    <Box mb={8}>{hoursByCustomer}</Box>
                    {entries.length > 0 && (
                        <Box mt={8}>
                            <Heading mb={8} size={"md"}>
                                Total hours
                            </Heading>
                            {hoursByEmployee}
                            {totalHours}
                            <ExportButtons
                                getValues={getValues}
                                entries={entries}
                            />
                        </Box>
                    )}
                </>
            )}
        </>
    )
}

export default Report
