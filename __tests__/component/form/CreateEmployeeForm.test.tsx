import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { CreateEmployeeForm } from "@/components/form/EmployeeForm"
import sinon, { spy } from "sinon"
import { Employee } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testEmployeeAllFields,
    testEmployeeRequiredFields,
} from "../../fixtures"

// eslint-disable-next-line id-match, id-length
import _ from "lodash"
import { User } from "firebase/auth"
import { employeeFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const employeeEndpointURL = `${NEXT_PUBLIC_API_URL}/employee`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    post: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<Employee>> =>
        (await pathSpy(path)) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const fillAndSubmitForm = async (employee: Employee) => {
    if (employee.firstName) {
        screen.getAllByTestId("form-field-firstName").forEach((field) => {
            fireEvent.change(field, {
                target: { value: employee.firstName },
            })
        })
    }
    if (employee.lastName) {
        screen.getAllByTestId("form-field-lastName").forEach((field) => {
            fireEvent.change(field, {
                target: { value: employee.lastName },
            })
        })
    }
    if (employee.email) {
        screen.getAllByTestId("form-field-email").forEach((field) => {
            fireEvent.change(field, {
                target: { value: employee.email },
            })
        })
    }
    if (employee.role) {
        screen.getAllByTestId("form-field-role").forEach((field) => {
            fireEvent.change(field, {
                target: { value: employee.role },
            })
        })
    }

    await waitFor(() =>
        screen
            .getAllByTestId("form-button-save")
            .forEach((save) => fireEvent.click(save))
    ).then(() =>
        screen
            .getAllByTestId("form-button-confirm")
            .forEach((confirm) => fireEvent.click(confirm))
    )
}

export const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]

test("a employee with the required fields only can be submitted", async () => {
    render(<CreateEmployeeForm />)
    await fillAndSubmitForm(testEmployeeRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(employeeEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            employeeFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
    ).toStrictEqual(testEmployeeRequiredFields)
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy(
        (createEmployeeResponse) => createEmployeeResponse
    )
    render(<CreateEmployeeForm afterSubmit={afterSubmitSpy} />)
    await fillAndSubmitForm(testEmployeeRequiredFields)

    await waitFor(() => expect(afterSubmitSpy.callCount).toEqual(1))
    expect(afterSubmitSpy.getCalls()[0].args[0]).toStrictEqual({
        isSuccess: true,
        isError: false,
        data: testEmployeeRequiredFields,
    })
})

test("onCancel is invoked", async () => {
    const onCancelSpy = spy(() => null)
    render(<CreateEmployeeForm onCancel={onCancelSpy} />)

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-cancel"))
    )

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", () => {
    Object.keys(testEmployeeRequiredFields).forEach((field) => {
        const form = render(<CreateEmployeeForm />)
        const reqBodySpy = sinon.spy((body) => body)
        const reqPathSpy = sinon.spy((path) => path)
        const employeeMissingRequired = _.omit(testEmployeeAllFields, field)

        fillAndSubmitForm(employeeMissingRequired as Employee)
            .then(() => {
                expect(reqBodySpy.callCount).toEqual(0)
                expect(reqPathSpy.callCount).toEqual(0)
            })
            .finally(() => form.unmount())
    })
})
