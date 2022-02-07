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

// eslint-disable-next-line id-match, id-length
import _ from "lodash"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/timesheet`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    // eslint-disable-next-line require-await
    put: async (
        path: string,
        body: object
    ): Promise<ApiUpdateResponse<Timesheet>> => pathSpy(path) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const fillAndSubmitForm = async (timesheet: Timesheet) => {
    const nameInput = screen.getByTestId("form-field-name")
    fireEvent.change(nameInput, { target: { value: timesheet.name || "" } })

    const descriptionInput = screen.getByTestId("form-field-description")
    fireEvent.change(descriptionInput, {
        target: { value: timesheet.description || "" },
    })

    const allocationInput = screen.getByTestId("form-field-allocation")
    fireEvent.change(allocationInput, {
        target: { value: timesheet.allocation || "" },
    })

    const employeeInput = screen.getByTestId("form-field-employee")
    fireEvent.change(employeeInput, {
        target: { value: timesheet.employee.id || "" },
    })

    const submitButton = screen.getByTestId("form-button-submit")
    await waitFor(() => fireEvent.click(submitButton))
}

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
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual({
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
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual({
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
    const submitTimeout = 100
    expect(testProject.id).toBeDefined()
    expect(testTimesheet.id).toBeDefined()
    for (const field of Object.keys(testTimesheetRequiredFields).filter(
        (key) => !["project", "employee"].includes(key)
    )) {
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
        const timesheetMissingRequired = _.omit(testTimesheetAllFields, field)

        /* eslint-disable no-await-in-loop */
        await fillAndSubmitForm(timesheetMissingRequired as Timesheet)
        await new Promise((resolve) =>
            setTimeout(() => resolve(null), submitTimeout)
        )
        /* eslint-enable */
        expect(pathSpy.callCount).toEqual(0)
        expect(bodySpy.callCount).toEqual(0)
        form.unmount()
    }
})
