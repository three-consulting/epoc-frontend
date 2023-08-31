import { Task } from "@/lib/types/apiTypes"
import { ApiGetResponse } from "@/lib/types/hooks"
import { createColumnHelper } from "@tanstack/react-table"
import _ from "lodash"
import React from "react"
import ItemTable, { ActionButton } from "../common/Table"
import { archivedFilter, StatusBadge } from "./utils"

type TaskTableProps = {
    response: ApiGetResponse<Task[]>
    customFilters?: ((task: Task) => boolean)[]
    actionButton?: ActionButton
    onOpenDetail?: (c: Task) => void
}

const TaskTable = ({
    response,
    customFilters,
    actionButton,
    onOpenDetail,
}: TaskTableProps) => {
    const columnHelper = createColumnHelper<Task>()
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

    const defaultSort = (items: Task[]) => _.sortBy(items, (x) => x.id)

    return (
        <ItemTable
            response={response}
            columns={columns}
            searchPlaceholder={"Search tasks"}
            tableHeight={"325px"}
            customFilters={customFilters}
            onOpenDetail={onOpenDetail}
            actionButton={actionButton}
            defaultSort={defaultSort}
            archivedFilter={archivedFilter}
        />
    )
}

export default TaskTable
