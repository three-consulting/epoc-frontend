import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { EditEmployeeForm } from "@/components/form/EmployeeForm"
import sinon, { spy } from "sinon"
import { Employee } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testEmployee,
    testEmployeeAllFields,
    testEmployeeRequiredFields,
    thirdTestEmployee,
} from "../../fixtures"

import { employeeFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const employeeEndpointURL = `${NEXT_PUBLIC_API_URL}/employee`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    put: async (
        path: string,
        body: object
    ): Promise<ApiUpdateResponse<Employee>> =>
        (await pathSpy(path)) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const isEmployeeKeys = (keys: unknown): keys is (keyof Employee)[] =>
    Array.isArray(keys) &&
    keys.every((key) =>
        [
            "id",
            "firstName",
            "lastName",
            "email",
            "startDate",
            "created",
            "updated",
            "firebaseUid",
            "role",
            "status",
        ].includes(key)
    )

const employeeKeys = (employee: Employee): (keyof Employee)[] => {
    const keys = Object.keys(employee)
    return isEmployeeKeys(keys) ? keys : []
}

const divWithChildrenMock = (children: JSX.Element, identifier: string) => (
    <div data-testid={identifier}>{children}</div>
)
const divWithoutChildrenMock = (identifier: string) => (
    <div data-testid={identifier} />
)

jest.mock("@chakra-ui/react", () => ({
    ...jest.requireActual("@chakra-ui/react"),
    PortalManager: jest.fn(({ children }) =>
        divWithChildrenMock(children, "portal")
    ),
    Modal: jest.fn(({ children }) => divWithChildrenMock(children, "modal")),
    ModalOverlay: jest.fn(({ children }) =>
        divWithChildrenMock(children, "overlay")
    ),
    ModalContent: jest.fn(({ children }) =>
        divWithChildrenMock(children, "content")
    ),
    ModalHeader: jest.fn(({ children }) =>
        divWithChildrenMock(children, "header")
    ),
    ModalFooter: jest.fn(({ children }) =>
        divWithChildrenMock(children, "footer")
    ),
    ModalBody: jest.fn(({ children }) => divWithChildrenMock(children, "body")),
    ModalCloseButton: jest.fn(() => divWithoutChildrenMock("close")),
}))

const fillAndSubmitForm = async (employee: Employee) => {
    if (employee.firstName) {
        fireEvent.change(screen.getByTestId("form-field-firstName"), {
            target: { value: employee.firstName },
        })
    }
    if (employee.lastName) {
        fireEvent.change(screen.getByTestId("form-field-lastName"), {
            target: { value: employee.lastName },
        })
    }
    if (employee.email) {
        fireEvent.change(screen.getByTestId("form-field-email"), {
            target: { value: employee.email },
        })
    }
    if (employee.role) {
        fireEvent.change(screen.getByTestId("form-field-role"), {
            target: { value: employee.role },
        })
    }

    await waitFor(() => fireEvent.click(screen.getByTestId("form-button-save")))
    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-confirm"))
    )
}

const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]
const testRequestPath = (): object => pathSpy.getCalls()[0].args[0]

test("a employee can be edited with required fields", async () => {
    expect(testEmployee.id).toBeDefined()
    render(
        <>
            {testEmployee.id && (
                <EditEmployeeForm employee={thirdTestEmployee} />
            )}
        </>
    )
    await fillAndSubmitForm(testEmployeeRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(employeeEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            employeeFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual({
        id: testEmployee.id,
        ...testEmployeeRequiredFields,
    })
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy(
        (updateEmployeeResponse) => updateEmployeeResponse
    )
    expect(testEmployee.id).toBeDefined()
    render(
        <>
            {testEmployee.id && (
                <EditEmployeeForm
                    afterSubmit={afterSubmitSpy}
                    employee={thirdTestEmployee}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testEmployeeRequiredFields)

    await waitFor(() => expect(afterSubmitSpy.callCount).toEqual(1))
    expect(afterSubmitSpy.getCalls()[0].args[0]).toStrictEqual({
        isSuccess: true,
        isError: false,
        data: { id: testEmployee.id, ...testEmployeeRequiredFields },
    })
})

test("onCancel is invoked", async () => {
    const onCancelSpy = spy(() => null)
    render(<EditEmployeeForm onCancel={onCancelSpy} employee={testEmployee} />)

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", async () => {
    const form = render(<EditEmployeeForm employee={testEmployee} />)
    const employeeMissingRequired = Object.assign({}, testEmployeeAllFields)
    employeeKeys(testEmployeeRequiredFields).forEach((key: keyof Employee) => {
        if (employeeMissingRequired[key]) {
            delete employeeMissingRequired[key]
        }
    })
    await fillAndSubmitForm(employeeMissingRequired)
    expect(bodySpy.callCount).toEqual(1)
    expect(pathSpy.callCount).toEqual(1)
    form.unmount()
})
