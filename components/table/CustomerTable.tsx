import { Customer } from "@/lib/types/apiTypes"
import { ApiGetResponse } from "@/lib/types/hooks"
import { createColumnHelper } from "@tanstack/react-table"
import _ from "lodash"
import React from "react"
import ItemTable, { ActionButton } from "../common/Table"
import { archivedFilter, StatusBadge } from "./utils"

type CustomerTableProps = {
    response: ApiGetResponse<Customer[]>
    actionButton?: ActionButton
    onOpenDetail?: (c: Customer) => void
}

const CustomerTable = ({
    response,
    actionButton,
    onOpenDetail,
}: CustomerTableProps) => {
    const columnHelper = createColumnHelper<Customer>()

    const columns = [
        columnHelper.accessor("name", {
            cell: (info) => info.getValue(),
            header: "Name",
        }),
        columnHelper.accessor("status", {
            cell: (info) => <StatusBadge status={info.getValue()} />,
            header: "Status",
        }),
    ]

    const defaultSort = (items: Customer[]) => _.sortBy(items, (x) => x.id)

    return (
        <ItemTable
            response={response}
            columns={columns}
            onOpenDetail={onOpenDetail}
            searchPlaceholder={"Search customers"}
            actionButton={actionButton}
            defaultSort={defaultSort}
            archivedFilter={archivedFilter}
        />
    )
}

export default CustomerTable
