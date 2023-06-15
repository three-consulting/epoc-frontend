import { Employee } from "@/lib/types/apiTypes"
import { ApiGetResponse } from "@/lib/types/hooks"
import { Badge } from "@chakra-ui/react"
import { createColumnHelper } from "@tanstack/react-table"
import _ from "lodash"
import React from "react"
import ItemTable, { ActionButton } from "../common/Table"
import { archivedFilter, StatusBadge } from "./utils"

type EmployeeTableProps = {
    response: ApiGetResponse<Employee[]>
    actionButton?: ActionButton
    onOpenDetail?: (c: Employee) => void
}

const EmployeeTable = ({
    response,
    actionButton,
    onOpenDetail,
}: EmployeeTableProps) => {
    const columnHelper = createColumnHelper<Employee>()

    const columns = [
        columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
            id: "Name",
        }),
        columnHelper.accessor("email", {
            cell: (info) => info.getValue(),
            header: "Email",
        }),
        columnHelper.accessor("role", {
            cell: (info) => <Badge>{info.getValue().toLowerCase()}</Badge>,
            header: "Role",
        }),
        columnHelper.accessor("status", {
            cell: (info) => <StatusBadge status={info.getValue()} />,
            header: "Status",
        }),
    ]

    const defaultSort = (items: Employee[]) => _.sortBy(items, (x) => x.id)

    return (
        <ItemTable
            response={response}
            columns={columns}
            onOpenDetail={onOpenDetail}
            searchPlaceholder={"Search employees"}
            actionButton={actionButton}
            defaultSort={defaultSort}
            archivedFilter={archivedFilter}
        />
    )
}

export default EmployeeTable
