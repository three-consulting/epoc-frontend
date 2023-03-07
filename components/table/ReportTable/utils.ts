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
import { round } from "lodash"

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
    return entries
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

export const handlePdfExportClick = (
    entries: Array<TimesheetEntry>,
    startDate: string,
    endDate: string,
    employee?: Employee
) => {
    const JsPDF = jsPDF
    const doc = new JsPDF()

    const totalHours =
        entries.length > 0
            ? entries.reduce((prv, crr) => prv + crr.quantity, 0)
            : 0

    const startX = 14

    doc.setFontSize(24)
    doc.text("Time Report", startX, 14)

    doc.setFontSize(12)
    doc.text(
        `Timeframe: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        startX,
        24
    )
    doc.text(
        `Employee: ${employee?.firstName ?? "-"} ${employee?.lastName ?? "-"}`,
        startX,
        29
    )
    doc.text(`Email: ${employee?.email ?? "-"}`, startX, 34)
    doc.text(`Total hours: ${totalHours}`, startX, 39)

    const headers = [
        "Date",
        "Client",
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

    autoTable(doc, {
        head: [headers],
        body: data,
        startY: 50,
    })

    doc.save(`timereport_${formatDate(startDate)}-${formatDate(endDate)}.pdf`)
}
