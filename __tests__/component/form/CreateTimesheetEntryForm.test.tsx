import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import sinon, { spy } from "sinon"
import { TimesheetEntry } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { CreateTimesheetEntryForm } from "@/components/form/TimesheetEntryForm"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    anotherTestTimeCategory,
    testTimeCategory,
    testTimesheetAllFields,
    testTimesheetEntryAllFields,
    testTimesheetEntryRequiredFields,
} from "../../fixtures"

// eslint-disable-next-line id-match, id-length
import _ from "lodash"
import { User } from "firebase/auth"

const timesheetEntryEndpointURL = `${NEXT_PUBLIC_API_URL}/timesheet-entry`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    // eslint-disable-next-line require-await
    post: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<TimesheetEntry>> =>
        pathSpy(path) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const fillAndSubmitForm = async (timesheetEntry: TimesheetEntry) => {
    const projectInput = screen.getByTestId("form-field-project")
    fireEvent.change(projectInput, {
        target: { value: timesheetEntry.timesheet.project.id },
    })

    const quantityInput = screen.getByTestId("form-field-quantity")
    if (timesheetEntry.quantity) {
        fireEvent.change(quantityInput, {
            target: { value: timesheetEntry.quantity },
        })
    }

    const descriptionInput = screen.getByTestId("form-field-description")
    if (timesheetEntry.description) {
        fireEvent.change(descriptionInput, {
            target: { value: timesheetEntry.description || "" },
        })
    }

    const taskInput = screen.getByTestId("form-field-task")
    fireEvent.change(taskInput, {
        target: { value: timesheetEntry.task },
    })

    const timeCategoryInput = screen.getByTestId("form-field-time-category")
    if (timesheetEntry.timeCategory) {
        fireEvent.change(timeCategoryInput, {
            target: { value: timesheetEntry.timeCategory },
        })
    }

    const submitButton = screen.getByTestId("form-button-submit")
    await waitFor(() => fireEvent.click(submitButton))
}

test("a timesheet entry with the required fields only can be submitted", async () => {
    render(
        <CreateTimesheetEntryForm
            timesheet={testTimesheetAllFields}
            projectId={1}
            date={"2022-01-01"}
            timeCategories={[testTimeCategory]}
        />
    )
    await fillAndSubmitForm(testTimesheetEntryRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(
        timesheetEntryEndpointURL
    )
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual(
        testTimesheetEntryRequiredFields
    )
})

test("a timesheet entry with all fields can be submitted", async () => {
    render(
        <CreateTimesheetEntryForm
            timesheet={testTimesheetAllFields}
            projectId={1}
            date={"2022-01-01"}
            timeCategories={[testTimeCategory]}
        />
    )
    await fillAndSubmitForm(testTimesheetEntryAllFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(
        timesheetEntryEndpointURL
    )
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual(testTimesheetAllFields)
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy(
        (createTimesheetEntryResponse) => createTimesheetEntryResponse
    )
    render(
        <CreateTimesheetEntryForm
            timesheet={testTimesheetAllFields}
            projectId={1}
            date={"2022-01-01"}
            timeCategories={[testTimeCategory]}
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
            timesheet={testTimesheetAllFields}
            projectId={1}
            date={"2022-01-01"}
            timeCategories={[testTimeCategory]}
        />
    )

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", async () => {
    const submitTimeout = 100
    for (const field of Object.keys(testTimesheetEntryRequiredFields).filter(
        (key) => key !== "project"
    )) {
        const form = render(
            <CreateTimesheetEntryForm
                timesheet={testTimesheetAllFields}
                projectId={1}
                date={"2022-01-01"}
                timeCategories={[testTimeCategory]}
            />
        )
        const timesheetEntryMissingRequired = _.omit(
            testTimesheetEntryAllFields,
            field
        )

        /* eslint-disable no-await-in-loop */
        await fillAndSubmitForm(timesheetEntryMissingRequired as TimesheetEntry)
        await new Promise((resolve) =>
            setTimeout(() => resolve(null), submitTimeout)
        )
        /* eslint-enable */
        expect(pathSpy.callCount).toEqual(0)
        expect(bodySpy.callCount).toEqual(0)
        form.unmount()
    }
})
