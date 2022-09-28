import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { spy } from "sinon"
import { TimesheetEntry } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { CreateTimesheetEntryForm } from "@/components/form/TimesheetEntryForm"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testTimesheet,
    testTask,
    testTimeCategory,
    testTimesheetEntryAllFields,
    testTimesheetEntryRequiredFields,
} from "../../fixtures"

import { User } from "firebase/auth"
import { timesheetEntryFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/timesheet-entry`
const bodySpy = spy((body) => body)
const pathSpy = spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    post: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<TimesheetEntry>> =>
        (await pathSpy(path)) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]
const testRequestPath = (): object => pathSpy.getCalls()[0].args[0]

const isTimesheetEntryKeys = (
    keys: unknown
): keys is (keyof TimesheetEntry)[] =>
    Array.isArray(keys) &&
    keys.every((key) =>
        [
            "id",
            "quantity",
            "date",
            "description",
            "timesheet",
            "timeCategory",
            "task",
            "created",
            "updated",
        ].includes(key)
    )

const timesheetEntryKeys = (
    timesheetEntry: TimesheetEntry
): (keyof TimesheetEntry)[] => {
    const keys = Object.keys(timesheetEntry)
    return isTimesheetEntryKeys(keys) ? keys : []
}

const fillAndSubmitForm = async (timesheetEntry: Partial<TimesheetEntry>) => {
    fireEvent.change(screen.getByTestId("form-field-quantity"), {
        target: { value: timesheetEntry.quantity },
    })

    if (timesheetEntry.description) {
        fireEvent.change(screen.getByTestId("form-field-description"), {
            target: { value: timesheetEntry.description },
        })
    }

    fireEvent.change(screen.getByTestId("form-field-task"), {
        target: { value: timesheetEntry.task?.id },
    })

    fireEvent.change(screen.getByTestId("form-field-time-category"), {
        target: { value: timesheetEntry.timeCategory?.id },
    })

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-submit"))
    )
}

test("a timesheet with the required fields only can be submitted", async () => {
    render(
        <CreateTimesheetEntryForm
            timesheet={testTimesheet}
            projectId={1}
            dates={[new Date("2022-07-09")]}
            timeCategories={[testTimeCategory]}
            tasks={[testTask]}
        />
    )
    await fillAndSubmitForm(testTimesheetEntryRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            timesheetEntryFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual(testTimesheetEntryRequiredFields)
})

test("a timesheet with all fields can be submitted", async () => {
    render(
        <CreateTimesheetEntryForm
            timesheet={testTimesheet}
            projectId={1}
            dates={[new Date("2022-07-09")]}
            timeCategories={[testTimeCategory]}
            tasks={[testTask]}
        />
    )
    await fillAndSubmitForm(testTimesheetEntryAllFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            timesheetEntryFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual(testTimesheetEntryAllFields)
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy(
        (createTimesheetEntryResponse) => createTimesheetEntryResponse
    )
    render(
        <CreateTimesheetEntryForm
            timesheet={testTimesheet}
            projectId={1}
            dates={[new Date("2022-07-09")]}
            timeCategories={[testTimeCategory]}
            tasks={[testTask]}
            afterSubmit={afterSubmitSpy}
        />
    )
    await fillAndSubmitForm(testTimesheetEntryRequiredFields)

    await waitFor(() => expect(afterSubmitSpy.callCount).toEqual(1))
    expect(afterSubmitSpy.getCalls()[0].args[0]).toStrictEqual({
        isSuccess: true,
        isError: false,
        data: testTimesheetEntryRequiredFields,
    })
})

test("onCancel is invoked", async () => {
    const onCancelSpy = spy(() => null)
    render(
        <CreateTimesheetEntryForm
            timesheet={testTimesheet}
            projectId={1}
            dates={[new Date("2022-07-09")]}
            timeCategories={[testTimeCategory]}
            tasks={[testTask]}
            onCancel={onCancelSpy}
        />
    )
    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", async () => {
    const form = render(
        <CreateTimesheetEntryForm
            timesheet={testTimesheet}
            projectId={1}
            dates={[new Date("2022-07-09")]}
            timeCategories={[testTimeCategory]}
            tasks={[testTask]}
        />
    )
    const timesheetMissingRequired = Object.assign(
        {},
        testTimesheetEntryAllFields
    )
    timesheetEntryKeys(testTimesheetEntryRequiredFields).forEach(
        (key: keyof TimesheetEntry) => {
            if (timesheetMissingRequired[key]) {
                delete timesheetMissingRequired[key]
            }
        }
    )

    await fillAndSubmitForm(timesheetMissingRequired)
    expect(bodySpy.callCount).toEqual(0)
    expect(pathSpy.callCount).toEqual(0)
    form.unmount()
})
