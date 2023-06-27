import { Timesheet } from "@/lib/types/apiTypes"
import { ApiGetResponse } from "@/lib/types/hooks"
import { createColumnHelper } from "@tanstack/react-table"
import _ from "lodash"
import React from "react"
import ItemTable, { ActionButton } from "../common/Table"
import { archivedFilter, StatusBadge } from "./utils"

type TimesheetTableProps = {
    response: ApiGetResponse<Timesheet[]>
    actionButton?: ActionButton
    onOpenDetail?: (c: Timesheet) => void
}

const TimesheetTable = ({
    response,
    actionButton,
    onOpenDetail,
}: TimesheetTableProps) => {
    const columnHelper = createColumnHelper<Timesheet>()
    const columns = [
        columnHelper.accessor(
            (row) => `${row.employee.firstName} ${row.employee.lastName}`,
            {
                id: "Employee",
            }
        ),
        columnHelper.accessor("allocation", {
            cell: (info) => info.getValue(),
            header: "Allocation",
        }),
        columnHelper.accessor("status", {
            cell: (info) => <StatusBadge status={info.getValue()} />,
            header: "Status",
        }),
    ]

    const defaultSort = (items: Timesheet[]) => _.sortBy(items, (x) => x.id)

    return (
        <ItemTable
            response={response}
            columns={columns}
            searchPlaceholder={"Search timesheets"}
            onOpenDetail={onOpenDetail}
            actionButton={actionButton}
            defaultSort={defaultSort}
            archivedFilter={archivedFilter}
        />
    )
}

export default TimesheetTable
