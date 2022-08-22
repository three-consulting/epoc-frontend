import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { EditCustomerForm } from "@/components/form/CustomerForm"
import sinon, { spy } from "sinon"
import { Customer } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testCustomer,
    testCustomerAllFields,
    testCustomerRequiredFields,
    thirdTestCustomer,
} from "../../fixtures"

// eslint-disable-next-line id-match, id-length
import _ from "lodash"
import { User } from "firebase/auth"
import { customerFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/customer`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    // eslint-disable-next-line require-await
    put: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<Customer>> => pathSpy(path) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const fillAndSubmitForm = async (customer: Customer) => {
    const nameInput = screen.getByTestId("form-field-name")
    fireEvent.change(nameInput, { target: { value: customer.name || "" } })

    const descriptionInput = screen.getByTestId("form-field-description")
    if (customer.description) {
        fireEvent.change(descriptionInput, {
            target: { value: customer.description },
        })
    }

    const submitButton = screen.getByTestId("form-button-submit")
    await waitFor(() => fireEvent.click(submitButton))
}

export const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]

test("a customer can be edited with required fields", async () => {
    expect(testCustomer.id).toBeDefined()
    render(
        <>
            {testCustomer.id && (
                <EditCustomerForm customer={thirdTestCustomer} />
            )}
        </>
    )
    await fillAndSubmitForm(testCustomerRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            customerFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
    ).toStrictEqual({
        id: testCustomer.id,
        ...testCustomerRequiredFields,
    })
})

test("a customer can be edited with all fields", async () => {
    expect(testCustomer.id).toBeDefined()
    render(
        <>{testCustomer.id && <EditCustomerForm customer={testCustomer} />}</>
    )
    await fillAndSubmitForm(testCustomerAllFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            customerFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
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
    render(<EditCustomerForm onCancel={onCancelSpy} customer={testCustomer} />)

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", async () => {
    const submitTimeout = 100
    for (const field of Object.keys(testCustomerRequiredFields)) {
        const form = render(<EditCustomerForm customer={testCustomer} />)
        const customerMissingRequired = _.omit(testCustomerAllFields, field)

        /* eslint-disable no-await-in-loop */
        await fillAndSubmitForm(customerMissingRequired as Customer)
        await new Promise((resolve) =>
            setTimeout(() => resolve(null), submitTimeout)
        )
        /* eslint-enable */

        expect(pathSpy.callCount).toEqual(0)
        expect(bodySpy.callCount).toEqual(0)
        form.unmount()
    }
})
