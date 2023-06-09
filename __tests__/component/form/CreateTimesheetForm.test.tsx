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

import { timesheetFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/timesheet`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    post: async (
        path: string,
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

const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]
const testRequestPath = (): object => pathSpy.getCalls()[0].args[0]

const fillAndSubmitForm = async (timesheet: Timesheet) => {
    if (timesheet.name) {
        fireEvent.change(screen.getByTestId("form-field-name"), {
            target: { value: timesheet.name },
        })
    }

    if (timesheet.description) {
        fireEvent.change(screen.getByTestId("form-field-description"), {
            target: { value: timesheet.description },
        })
    }

    fireEvent.change(screen.getByTestId("form-field-rate"), {
        target: { value: timesheet.rate || "" },
    })

    if (timesheet.allocation) {
        fireEvent.change(screen.getByTestId("form-field-allocation"), {
            target: { value: timesheet.allocation },
        })
    }

    if (timesheet.employee) {
        fireEvent.change(screen.getByTestId("form-field-employee"), {
            target: { value: timesheet.employee.id },
        })
    }

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-submit"))
    )
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
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            timesheetFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual(testTimesheetRequiredFields)
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
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            timesheetFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual(testTimesheetAllFields)
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

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-cancel"))
    )

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", async () => {
    const form = render(
        <CreateTimesheetForm
            employees={[testEmployee]}
            project={testProject}
            projectId={1}
        />
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
