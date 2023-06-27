import React, { useContext } from "react"
import { Project } from "@/lib/types/apiTypes"
import { createColumnHelper } from "@tanstack/react-table"
import ItemTable, { ActionButton } from "../common/Table"
import { ApiGetResponse } from "@/lib/types/hooks"
import { MediaContext } from "@/lib/contexts/MediaContext"
import _ from "lodash"
import { archivedFilter, StatusBadge } from "./utils"

type ProjectTableProps = {
    response: ApiGetResponse<Project[]>
    actionButton?: ActionButton
}

const ProjectTable = ({ response, actionButton }: ProjectTableProps) => {
    const columnHelper = createColumnHelper<Project>()
    const { isLarge } = useContext(MediaContext)

    const columns = [
        columnHelper.accessor("name", {
            cell: (info) => info.getValue(),
            header: "Name",
        }),
        columnHelper.accessor((row) => row.customer.name, {
            id: "Customer",
        }),
        columnHelper.accessor("status", {
            cell: (info) => <StatusBadge status={info.getValue()} />,
            header: "Status",
        }),
    ]

    const defaultSort = (items: Project[]) => _.sortBy(items, (x) => x.id)

    return (
        <ItemTable
            response={response}
            columns={isLarge ? columns : columns.slice(0, 1)}
            searchPlaceholder={"Search projects"}
            rowLink={(project: Project) => `/project/${project.id}`}
            actionButton={actionButton}
            defaultSort={defaultSort}
            archivedFilter={archivedFilter}
        />
    )
}

export default ProjectTable
