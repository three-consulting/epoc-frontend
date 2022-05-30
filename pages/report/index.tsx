import React, { useContext } from "react"
import type { NextPage } from "next"
import { Heading } from "@chakra-ui/layout"
import { useTimeIntervalTimesheetEntries } from "@/lib/hooks/useTimesheetEntries"
import { UserContext } from "@/lib/contexts/FirebaseAuthContext"

const Report: NextPage = () => {
    const { user } = useContext(UserContext)
    const reportsRespose = useTimeIntervalTimesheetEntries(user)

    return (
        <div>
            {reportsRespose.isSuccess && (
                <Heading fontWeight="black" margin="1rem 0rem">
                    Reports
                </Heading>
            )}
        </div>
    )
}

export default Report
