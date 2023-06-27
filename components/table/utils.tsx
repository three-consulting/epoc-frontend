import React from "react"
import { Badge } from "@chakra-ui/react"

type StatusBadgeProps = {
    status: "ARCHIVED" | "ACTIVE" | undefined
}

export const StatusBadge = ({ status }: StatusBadgeProps) =>
    status === "ACTIVE" ? (
        <Badge colorScheme="green">ACTIVE</Badge>
    ) : (
        <Badge colorScheme="purple">ARCHIVED</Badge>
    )

export const toggleArchived = (
    b: boolean,
    setValue: (s: string, t: string) => void
) => {
    setValue("status", b ? "ARCHIVED" : "ACTIVE")
}

export const archivedFilter = ({
    status,
}: {
    status?: "ARCHIVED" | "ACTIVE"
}) => status === "ACTIVE"
