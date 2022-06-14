import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import sinon, { spy } from "sinon"
import { Timesheet } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { CreateTimesheetForm } from "@/components/form/TimesheetForm"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testEmployee,
    testProject,
    testTimesheetAllFields,
    testTimesheetRequiredFields,
} from "../../fixtures"

// eslint-disable-next-line id-match, id-length
import _ from "lodash"
import { User } from "firebase/auth"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/timesheet`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    // eslint-disable-next-line require-await
    post: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<Timesheet>> => pathSpy(path) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const fillAndSubmitForm = async (timesheet: Timesheet) => {
    const nameInput = screen.getByTestId("form-field-name")
    if (timesheet.name) {
        fireEvent.change(nameInput, { target: { value: timesheet.name } })
    }

    const descriptionInput = screen.getByTestId("form-field-description")
    if (timesheet.description) {
        fireEvent.change(descriptionInput, {
            target: { value: timesheet.description },
        })
    }

    const rateInput = screen.getByTestId("form-field-rate")
    fireEvent.change(rateInput, {
        target: { value: timesheet.rate || "" },
    })

    const allocationInput = screen.getByTestId("form-field-allocation")
    if (timesheet.allocation) {
        fireEvent.change(allocationInput, {
            target: { value: timesheet.allocation },
        })
    }

    const employeeInput = screen.getByTestId("form-field-employee")
    if (timesheet.employee) {
        fireEvent.change(employeeInput, {
            target: { value: timesheet.employee.id },
        })
    }

    const submitButton = screen.getByTestId("form-button-submit")
    await waitFor(() => fireEvent.click(submitButton))
}

test("a timesheet with the required fields only can be submitted", async () => {
    render(
        <CreateTimesheetForm
            employees={[testEmployee]}
            project={testProject}
            projectId={1}
        />
    )
    await fillAndSubmitForm(testTimesheetRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual(
        testTimesheetRequiredFields
    )
})

test("a timesheet with all fields can be submitted", async () => {
    render(
        <CreateTimesheetForm
            employees={[testEmployee]}
            project={testProject}
            projectId={1}
        />
    )
    await fillAndSubmitForm(testTimesheetAllFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual(testTimesheetAllFields)
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy(
        (createTimesheetResponse) => createTimesheetResponse
    )
    render(
        <CreateTimesheetForm
            employees={[testEmployee]}
            project={testProject}
            projectId={1}
            afterSubmit={afterSubmitSpy}
        />
    )
    await fillAndSubmitForm(testTimesheetRequiredFields)

    await waitFor(() => expect(afterSubmitSpy.callCount).toEqual(1))
    expect(afterSubmitSpy.getCalls()[0].args[0]).toStrictEqual({
        isSuccess: true,
        isError: false,
        data: testTimesheetRequiredFields,
    })
})

test("onCancel is invoked", async () => {
    const onCancelSpy = spy(() => null)
    render(
        <CreateTimesheetForm
            employees={[testEmployee]}
            project={testProject}
            projectId={1}
            onCancel={onCancelSpy}
        />
    )

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", async () => {
    const submitTimeout = 100
    for (const field of Object.keys(testTimesheetRequiredFields).filter(
        (key) => key !== "project"
    )) {
        const form = render(
            <CreateTimesheetForm
                employees={[testEmployee]}
                project={testProject}
                projectId={1}
            />
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
