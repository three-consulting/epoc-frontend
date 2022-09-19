import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import sinon, { spy } from "sinon"
import { Timesheet } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { EditTimesheetForm } from "@/components/form/TimesheetForm"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testEmployee,
    testProject,
    testTimesheet,
    testTimesheetAllFields,
    testTimesheetRequiredFields,
} from "../../fixtures"

import { User } from "firebase/auth"
import { timesheetFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/timesheet`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    put: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<Timesheet>> =>
        (await pathSpy(path)) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const isTimesheetKeys = (keys: unknown): keys is (keyof Timesheet)[] =>
    Array.isArray(keys) &&
    keys.every((key) =>
        [
            "id",
            "name",
            "description",
            "rate",
            "allocation",
            "project",
            "employee",
            "created",
            "updated",
            "status",
        ].includes(key)
    )

const timesheetKeys = (timesheet: Timesheet): (keyof Timesheet)[] => {
    const keys = Object.keys(timesheet)
    return isTimesheetKeys(keys) ? keys : []
}
const fillAndSubmitForm = async (timesheet: Timesheet) => {
    fireEvent.change(screen.getByTestId("form-field-name"), {
        target: { value: timesheet.name || "" },
    })

    fireEvent.change(screen.getByTestId("form-field-description"), {
        target: { value: timesheet.description || "" },
    })

    fireEvent.change(screen.getByTestId("form-field-rate"), {
        target: { value: timesheet.rate || "" },
    })

    fireEvent.change(screen.getByTestId("form-field-allocation"), {
        target: { value: timesheet.allocation || "" },
    })

    fireEvent.change(screen.getByTestId("form-field-employee"), {
        target: { value: timesheet.employee?.id || "" },
    })

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-submit"))
    )
}

const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]
const testRequestPath = (): object => pathSpy.getCalls()[0].args[0]

test("a timesheet can be edited with required fields", async () => {
    expect(testProject.id).toBeDefined()
    expect(testTimesheet.id).toBeDefined()
    render(
        <>
            {testProject.id && testTimesheet.id && (
                <EditTimesheetForm
                    employees={[testEmployee]}
                    project={testProject}
                    projectId={testProject.id}
                    timesheet={testTimesheet}
                    timesheetId={testTimesheet.id}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testTimesheetRequiredFields)
    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            timesheetFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual({
        id: testTimesheet.id,
        ...testTimesheetRequiredFields,
    })
})

test("a timesheet can be edited with all fields", async () => {
    expect(testProject.id).toBeDefined()
    expect(testTimesheet.id).toBeDefined()
    render(
        <>
            {testProject.id && testTimesheet.id && (
                <EditTimesheetForm
                    employees={[testEmployee]}
                    project={testProject}
                    projectId={testProject.id}
                    timesheet={testTimesheet}
                    timesheetId={testTimesheet.id}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testTimesheetAllFields)
    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            timesheetFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual({
        id: testTimesheet.id,
        ...testTimesheetAllFields,
    })
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy(
        (createTimesheetResponse) => createTimesheetResponse
    )
    expect(testProject.id).toBeDefined()
    expect(testTimesheet.id).toBeDefined()
    render(
        <>
            {testProject.id && testTimesheet.id && (
                <EditTimesheetForm
                    employees={[testEmployee]}
                    project={testProject}
                    projectId={testProject.id}
                    timesheet={testTimesheet}
                    timesheetId={testTimesheet.id}
                    afterSubmit={afterSubmitSpy}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testTimesheetRequiredFields)

    await waitFor(() => expect(afterSubmitSpy.callCount).toEqual(1))
    expect(afterSubmitSpy.getCalls()[0].args[0]).toStrictEqual({
        isSuccess: true,
        isError: false,
        data: { id: testTimesheet.id, ...testTimesheetRequiredFields },
    })
})

test("onCancel is invoked", async () => {
    const onCancelSpy = spy(() => null)
    expect(testProject.id).toBeDefined()
    expect(testTimesheet.id).toBeDefined()
    render(
        <>
            {testProject.id && testTimesheet.id && (
                <EditTimesheetForm
                    employees={[testEmployee]}
                    project={testProject}
                    projectId={testProject.id}
                    timesheet={testTimesheet}
                    timesheetId={testTimesheet.id}
                    onCancel={onCancelSpy}
                />
            )}
        </>
    )
    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing when editing timesheet form", async () => {
    expect(testProject.id).toBeDefined()
    expect(testTimesheet.id).toBeDefined()
    const form = render(
        <>
            {testProject.id && testTimesheet.id && (
                <EditTimesheetForm
                    employees={[testEmployee]}
                    project={testProject}
                    projectId={testProject.id}
                    timesheet={testTimesheet}
                    timesheetId={testTimesheet.id}
                />
            )}
        </>
    )
    const timesheetMissingRequired = Object.assign({}, testTimesheetAllFields)
    timesheetKeys(testTimesheetRequiredFields).forEach(
        (key: keyof Timesheet) => {
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
