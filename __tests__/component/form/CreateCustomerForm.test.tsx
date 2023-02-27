import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { CreateCustomerForm } from "@/components/form/CustomerForm"
import sinon, { spy } from "sinon"
import { Customer } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testAdminUser,
    testCustomerAllFields,
    testCustomerRequiredFields,
} from "../../fixtures"

import { User } from "firebase/auth"
import { customerFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/customer`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    post: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<Customer>> =>
        (await pathSpy(path)) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]
const testRequestPath = (): object => pathSpy.getCalls()[0].args[0]

const isCustomerKeys = (keys: unknown): keys is (keyof Customer)[] =>
    Array.isArray(keys) &&
    keys.every((key) =>
        [
            "id",
            "name",
            "description",
            "createds",
            "updated",
            "enabled",
        ].includes(key)
    )

const customerKeys = (customer: Customer): (keyof Customer)[] => {
    const keys = Object.keys(customer)
    return isCustomerKeys(keys) ? keys : []
}

const fillAndSubmitForm = async (customer: Customer) => {
    if (customer.name) {
        fireEvent.change(screen.getByTestId("form-field-name"), {
            target: { value: customer.name },
        })
    }

    if (customer.description) {
        fireEvent.change(screen.getByTestId("form-field-description"), {
            target: { value: customer.description },
        })
    }

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-submit"))
    )
}

test("a customer with the required fields only can be submitted", async () => {
    render(<CreateCustomerForm user={testAdminUser} />)
    await fillAndSubmitForm(testCustomerRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            customerFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual(testCustomerRequiredFields)
})

test("a customer with all fields can be submitted", async () => {
    render(<CreateCustomerForm user={testAdminUser} />)
    await fillAndSubmitForm(testCustomerAllFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            customerFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual(testCustomerAllFields)
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy(
        (createCustomerResponse) => createCustomerResponse
    )
    render(
        <CreateCustomerForm afterSubmit={afterSubmitSpy} user={testAdminUser} />
    )
    await fillAndSubmitForm(testCustomerRequiredFields)

    await waitFor(() => expect(afterSubmitSpy.callCount).toEqual(1))
    expect(afterSubmitSpy.getCalls()[0].args[0]).toStrictEqual({
        isSuccess: true,
        isError: false,
        data: testCustomerRequiredFields,
    })
})

test("onCancel is invoked", async () => {
    const onCancelSpy = spy(() => null)
    render(<CreateCustomerForm onCancel={onCancelSpy} user={testAdminUser} />)

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", async () => {
    const form = render(<CreateCustomerForm user={testAdminUser} />)
    const customerMissingRequired = Object.assign({}, testCustomerAllFields)
    customerKeys(testCustomerRequiredFields).forEach((key: keyof Customer) => {
        if (customerMissingRequired[key]) {
            delete customerMissingRequired[key]
        }
    })
    await fillAndSubmitForm(customerMissingRequired)
    expect(bodySpy.callCount).toEqual(0)
    expect(pathSpy.callCount).toEqual(0)
    form.unmount()
})
