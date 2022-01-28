import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateCustomerForm } from '@/components/form/CustomerForm';
import sinon, { spy } from 'sinon';
import { Customer } from '@/lib/types/apiTypes';
import { ApiUpdateResponse } from '@/lib/types/hooks';

const customerEndpointURL = `${process.env.NEXT_PUBLIC_API_URL}/customer`;
const bodySpy = sinon.spy((body) => body);
const pathSpy = sinon.spy((path) => path);

jest.mock('@/lib/utils/fetch', () => ({
    post: async (path: string, body: object): Promise<ApiUpdateResponse<Customer>> => pathSpy(path) && bodySpy(body),
}));

const testCustomerRequiredFields: Customer = { name: 'Name' };
const testCustomerAllFields: Customer = { name: 'anotherName', description: 'description' };

afterEach(() => {
    bodySpy.resetHistory();
    pathSpy.resetHistory();
});

const fillAndSubmitForm = async (customer: Customer) => {
    const nameInput = screen.getByTestId('form-field-name');
    customer.name && fireEvent.change(nameInput, { target: { value: customer.name } });

    const descriptionInput = screen.getByTestId('form-field-description');
    customer.description && fireEvent.change(descriptionInput, { target: { value: customer.description } });

    const submitButton = screen.getByTestId('form-button-submit');
    await waitFor(() => fireEvent.click(submitButton));
};

test('a customer with the required fields only can be submitted', async () => {
    render(<CreateCustomerForm />);
    await fillAndSubmitForm(testCustomerRequiredFields);

    await waitFor(() => expect(bodySpy.callCount).toEqual(1));
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL);
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual(testCustomerRequiredFields);
});

test('a customer with all fields can be submitted', async () => {
    render(<CreateCustomerForm />);
    await fillAndSubmitForm(testCustomerAllFields);

    await waitFor(() => expect(bodySpy.callCount).toEqual(1));
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL);
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual(testCustomerAllFields);
});

test('afterSubmit is invoked with the correct data', async () => {
    const afterSubmitSpy = spy((createCustomerResponse) => createCustomerResponse);
    render(<CreateCustomerForm afterSubmit={afterSubmitSpy} />);
    await fillAndSubmitForm(testCustomerRequiredFields);

    await waitFor(() => expect(afterSubmitSpy.callCount).toEqual(1));
    expect(afterSubmitSpy.getCalls()[0].args[0]).toStrictEqual({
        isSuccess: true,
        isError: false,
        data: testCustomerRequiredFields,
    });
});

test('onCancel is invoked', async () => {
    const onCancelSpy = spy(() => undefined);
    render(<CreateCustomerForm onCancel={onCancelSpy} />);

    const cancelButton = screen.getByTestId('form-button-cancel');
    await waitFor(() => fireEvent.click(cancelButton));

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1));
});
