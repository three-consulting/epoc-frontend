import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { EditCustomerForm } from "@/components/form/CustomerForm"
import sinon, { spy } from "sinon"
import { Customer } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testAdminUser,
    testCustomer,
    testCustomerAllFields,
    testCustomerRequiredFields,
    thirdTestCustomer,
} from "../../fixtures"

import { User } from "firebase/auth"
import { customerFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/customer`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    put: async (
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
    fireEvent.change(screen.getByTestId("form-field-name"), {
        target: { value: customer.name || "" },
    })

    if (customer.description) {
        fireEvent.change(screen.getByTestId("form-field-description"), {
            target: { value: customer.description },
        })
    }

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-submit"))
    )
}

const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]
const testRequestPath = (): object => pathSpy.getCalls()[0].args[0]

test("a customer can be edited with required fields", async () => {
    expect(testCustomer.id).toBeDefined()
    render(
        <>
            {testCustomer.id && (
                <EditCustomerForm
                    customer={thirdTestCustomer}
                    user={testAdminUser}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testCustomerRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            customerFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual({
        id: testCustomer.id,
        ...testCustomerRequiredFields,
    })
})

test("a customer can be edited with all fields", async () => {
    expect(testCustomer.id).toBeDefined()
    render(
        <>
            {testCustomer.id && (
                <EditCustomerForm
                    customer={testCustomer}
                    user={testAdminUser}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testCustomerAllFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            customerFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual({
        id: testCustomer.id,
        ...testCustomerAllFields,
    })
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy(
        (updateCustomerResponse) => updateCustomerResponse
    )
    expect(testCustomer.id).toBeDefined()
    render(
        <>
            {testCustomer.id && (
                <EditCustomerForm
                    afterSubmit={afterSubmitSpy}
                    customer={testCustomer}
                    user={testAdminUser}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testCustomerAllFields)

    await waitFor(() => expect(afterSubmitSpy.callCount).toEqual(1))
    expect(afterSubmitSpy.getCalls()[0].args[0]).toStrictEqual({
        isSuccess: true,
        isError: false,
        data: { id: testCustomer.id, ...testCustomerAllFields },
    })
})

test("onCancel is invoked", async () => {
    const onCancelSpy = spy(() => null)
    render(
        <EditCustomerForm
            onCancel={onCancelSpy}
            customer={testCustomer}
            user={testAdminUser}
        />
    )

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", async () => {
    const form = render(
        <EditCustomerForm customer={testCustomer} user={testAdminUser} />
    )
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
