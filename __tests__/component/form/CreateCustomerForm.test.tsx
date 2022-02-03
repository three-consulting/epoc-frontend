import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { CreateCustomerForm } from "@/components/form/CustomerForm"
import sinon, { spy } from "sinon"
import { Customer } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testCustomerAllFields,
    testCustomerRequiredFields,
} from "../../fixtures"

// eslint-disable-next-line id-match, id-length
import _ from "lodash"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/customer`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    // eslint-disable-next-line require-await
    post: async (
        path: string,
        body: object
    ): Promise<ApiUpdateResponse<Customer>> => pathSpy(path) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const fillAndSubmitForm = async (customer: Customer) => {
    const nameInput = screen.getByTestId("form-field-name")
    if (customer.name) {
        fireEvent.change(nameInput, { target: { value: customer.name } })
    }

    const descriptionInput = screen.getByTestId("form-field-description")
    if (customer.description) {
        fireEvent.change(descriptionInput, {
            target: { value: customer.description },
        })
    }

    const submitButton = screen.getByTestId("form-button-submit")
    await waitFor(() => fireEvent.click(submitButton))
}

test("a customer with the required fields only can be submitted", async () => {
    render(<CreateCustomerForm />)
    await fillAndSubmitForm(testCustomerRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual(
        testCustomerRequiredFields
    )
})

test("a customer with all fields can be submitted", async () => {
    render(<CreateCustomerForm />)
    await fillAndSubmitForm(testCustomerAllFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual(testCustomerAllFields)
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy(
        (createCustomerResponse) => createCustomerResponse
    )
    render(<CreateCustomerForm afterSubmit={afterSubmitSpy} />)
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
    render(<CreateCustomerForm onCancel={onCancelSpy} />)

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", async () => {
    const submitTimeout = 100
    for (const field of Object.keys(testCustomerRequiredFields)) {
        const form = render(<CreateCustomerForm />)
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
