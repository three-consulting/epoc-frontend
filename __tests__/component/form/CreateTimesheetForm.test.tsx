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
import { timesheetFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/timesheet`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    post: async (
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
export const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]

const fillAndSubmitForm = async (timesheet: Timesheet) => {
    if (timesheet.name) {
        screen.getAllByTestId("form-field-name").forEach((nameInput) =>
            fireEvent.change(nameInput, {
                target: { value: timesheet.name },
            })
        )
    }

    if (timesheet.description) {
        screen
            .getAllByTestId("form-field-description")
            .forEach((descriptionInput) =>
                fireEvent.change(descriptionInput, {
                    target: { value: timesheet.description },
                })
            )
    }

    screen.getAllByTestId("form-field-rate").forEach((rateInput) =>
        fireEvent.change(rateInput, {
            target: { value: timesheet.rate || "" },
        })
    )

    if (timesheet.allocation) {
        screen
            .getAllByTestId("form-field-allocation")
            .forEach((allocationInput) =>
                fireEvent.change(allocationInput, {
                    target: { value: timesheet.allocation },
                })
            )
    }

    if (timesheet.employee) {
        screen.getAllByTestId("form-field-employee").forEach((employeeInput) =>
            fireEvent.change(employeeInput, {
                target: { value: timesheet.employee.id },
            })
        )
    }

    await waitFor(() =>
        screen
            .getAllByTestId("form-button-submit")
            .forEach((submit) => fireEvent.click(submit))
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
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            timesheetFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
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
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            timesheetFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
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

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", () => {
    Object.keys(testTimesheetRequiredFields)
        .filter((key) => key !== "project")
        .forEach((field) => {
            const form = render(
                <CreateTimesheetForm
                    employees={[testEmployee]}
                    project={testProject}
                    projectId={1}
                />
            )
            const reqBodySpy = sinon.spy((body) => body)
            const reqPathSpy = sinon.spy((path) => path)
            const timesheetMissingRequired = _.omit(
                testTimesheetAllFields,
                field
            )

            fillAndSubmitForm(timesheetMissingRequired as Timesheet)
                .then(() => {
                    expect(reqBodySpy.callCount).toEqual(0)
                    expect(reqPathSpy.callCount).toEqual(0)
                })
                .finally(() => form.unmount())
        })
})
