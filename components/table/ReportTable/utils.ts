import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    Customer,
    Employee,
    Project,
    Task,
    Timesheet,
    TimesheetEntry,
} from "@/lib/types/apiTypes"
import { downloadFile } from "@/lib/utils/common"
import { getText } from "@/lib/utils/fetch"
import { User } from "firebase/auth"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { groupBy, round, toArray, mapValues, sum, sumBy, toPairs } from "lodash"
import { DateTime } from "luxon"

export const customersByEmployeeTimesheets = (
    timesheets: Timesheet[],
    employeeId: number
) =>
    timesheets
        .filter((timesheet) => timesheet.employee.id === employeeId)
        .map((timesheet) => timesheet.project.customer)

export const entriesQuantitySum = (entries: TimesheetEntry[]) =>
    round(
        entries.reduce((total, currentItem) => total + currentItem.quantity, 0),
        2
    )

export const totalIncome = (entries: TimesheetEntry[]) =>
    round(
        entries.reduce(
            (total, currentItem) =>
                total + currentItem.timesheet.rate * currentItem.quantity,
            0
        ),
        2
    )

export const entriesByProject = (
    entries: TimesheetEntry[],
    projectId: number
) => entries.filter((entry) => entry.timesheet.project?.id === projectId)

export const entriesByCustomer = (
    entries: TimesheetEntry[],
    customerId: number
) =>
    entries.filter(
        (entry) => entry.timesheet.project.customer?.id === customerId
    )

export const entriesByEmployee = (
    entries: TimesheetEntry[],
    employeeId: number
) => entries.filter((entry) => entry.timesheet.employee?.id === employeeId)

export const projectByCustomer = (projects: Project[], customerId: number) =>
    projects.filter((project) => project.customer?.id === customerId)

export const projectsByEmployeeTimesheets = (
    timesheets: Timesheet[],
    employeeId: number
) =>
    timesheets
        .filter((timesheet) => timesheet.employee.id === employeeId)
        .map((timesheet) => timesheet.project)

export const tasksByProject = (tasks: Task[], projectId: number) =>
    tasks.filter((task) => task.project.id === projectId)

export const entriesByTask = (entries: TimesheetEntry[], taskId: number) =>
    entries.filter((entry) => entry.task.id === taskId)

export const taskByProject = (tasks: Task[], projectId: number) =>
    tasks.filter((task) => task.project.id === projectId)

export const formatDate = (date?: unknown) =>
    typeof date === "string" ? date.split("-").reverse().join(".") : ""

export const filterEntries = (
    entries: Array<TimesheetEntry>,
    employee?: Employee,
    project?: Project,
    customer?: Customer,
    task?: Task
): Array<TimesheetEntry> => {
    if (employee?.id) {
        entries = entries.filter(
            (entry) => entry.timesheet.employee.id === employee.id
        )
    }
    if (project?.id) {
        entries = entries.filter(
            (entry) => entry.timesheet.project.id === project.id
        )
    }
    if (customer?.id) {
        entries = entries.filter(
            (entry) => entry.timesheet.project.customer.id === customer.id
        )
    }
    if (task?.id) {
        entries = entries.filter((entry) => entry.task.id === task.id)
    }
    return entries.sort(
        (ent1, ent2) =>
            DateTime.fromISO(ent1.date).valueOf() -
            DateTime.fromISO(ent2.date).valueOf()
    )
}

export const handleCsvExportClick = async (
    user: User,
    startDate: string,
    endDate: string,
    params?: {
        employee?: Employee
        project?: Project
        customer?: Customer
        task?: Task
    }
) => {
    const email = params?.employee?.email
    const projectId = params?.project?.id
    const customerId = params?.customer?.id
    const taskId = params?.task?.id

    const res = await getText(
        `${NEXT_PUBLIC_API_URL}/timesheet-entry/csv-export`,
        user,
        {
            startDate,
            endDate,
            ...(email && { email }),
            ...(projectId && { projectId }),
            ...(customerId && { customerId }),
            ...(taskId && { taskId }),
        }
    )
    const blob = new Blob([res], { type: "text/csv;charset=utf-8" })
    const fileName = `entries_${startDate}_${endDate}.csv`
    downloadFile(blob, fileName)
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

    const groupedHours = groupBy(
        allEntries.flat().map((x) => ({
            name: `${x.timesheet.employee.firstName} ${x.timesheet.employee.lastName}`,
            quantity: x.quantity as number,
        })),
        (x) => x.name
    )
    const allEmployeeHours = mapValues(groupedHours, (x) =>
        sumBy(x, "quantity")
    )
    const totalHours = sum(Object.values(allEmployeeHours))
    document.text(`Total hours: ${totalHours}`, 14, 40)
    autoTable(document, {
        head: [["Name", "Hours"]],
        body: toPairs(allEmployeeHours),
        startY: 60,
    })
    document.addPage()
}

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

export const handlePdfExportClick = (
    timesheetEntries: Array<TimesheetEntry>,
    startDate: string,
    endDate: string
) => {
    const JsPDF = jsPDF
    const doc = new JsPDF()
    const startX = 14

    const groupedEntries = toArray(
        groupBy(timesheetEntries, (entry) => entry.timesheet.employee.id)
    )

    if (groupedEntries.length > 1) {
        createTitlePage(groupedEntries, doc, startDate, endDate)
    }

    createEmployeeHoursPages(groupedEntries, doc, startDate, endDate, startX)

    doc.save(`timereport_${formatDate(startDate)}-${formatDate(endDate)}.pdf`)
}
