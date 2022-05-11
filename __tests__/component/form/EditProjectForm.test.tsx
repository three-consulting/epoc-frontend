import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import sinon, { spy } from "sinon"
import { Project } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { EditProjectForm } from "@/components/form/ProjectForm"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    anotherTestCustomer,
    anotherTestEmployee,
    testCustomer,
    testEmployee,
    testProject,
    testProjectAllFields,
    testProjectRequiredFields,
} from "../../fixtures"

// eslint-disable-next-line id-match, id-length
import _ from "lodash"
import { User } from "firebase/auth"

const projectEndpointURL = `${NEXT_PUBLIC_API_URL}/project`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    // eslint-disable-next-line require-await
    put: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<Project>> => pathSpy(path) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const fillAndSubmitForm = async (project: Project) => {
    const nameInput = screen.getByTestId("form-field-name")
    fireEvent.change(nameInput, { target: { value: project.name || "" } })

    const descriptionInput = screen.getByTestId("form-field-description")
    fireEvent.change(descriptionInput, {
        target: { value: project.description || "" },
    })

    const startDateInput = screen.getByTestId("form-field-start-date")
    fireEvent.change(startDateInput, {
        target: { value: project.startDate || "" },
    })

    const endDateInput = screen.getByTestId("form-field-end-date")
    fireEvent.change(endDateInput, {
        target: { value: project.endDate || "" },
    })

    const customerInput = screen.getByTestId("form-field-customer")
    if (project.customer) {
        fireEvent.change(customerInput, {
            target: { value: project.customer.id },
        })
    }

    const managingEmployeeInput = screen.getByTestId(
        "form-field-managing-employee"
    )
    if (project.managingEmployee) {
        fireEvent.change(managingEmployeeInput, {
            target: { value: project.managingEmployee.id },
        })
    }

    const submitButton = screen.getByTestId("form-button-submit")
    await waitFor(() => fireEvent.click(submitButton))
}

test("a project can be edited with required fields", async () => {
    expect(testProject.id).toBeDefined()
    render(
        <>
            {testProject.id && (
                <EditProjectForm
                    employees={[testEmployee, anotherTestEmployee]}
                    customers={[testCustomer, anotherTestCustomer]}
                    project={testProject}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testProjectRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(projectEndpointURL)
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual({
        id: testProject.id,
        ...testProjectRequiredFields,
    })
})

test("a project can be edited with all fields", async () => {
    expect(testProject.id).toBeDefined()
    render(
        <>
            {testProject.id && (
                <EditProjectForm
                    employees={[testEmployee, anotherTestEmployee]}
                    customers={[testCustomer, anotherTestCustomer]}
                    project={testProject}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testProjectAllFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(projectEndpointURL)
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual({
        id: testProject.id,
        ...testProjectAllFields,
    })
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy((createProjectResponse) => createProjectResponse)
    expect(testProject.id).toBeDefined()
    render(
        <>
            {testProject.id && (
                <EditProjectForm
                    employees={[testEmployee, anotherTestEmployee]}
                    customers={[testCustomer, anotherTestCustomer]}
                    project={testProject}
                    afterSubmit={afterSubmitSpy}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testProjectRequiredFields)

    await waitFor(() => expect(afterSubmitSpy.callCount).toEqual(1))
    expect(afterSubmitSpy.getCalls()[0].args[0]).toStrictEqual({
        isSuccess: true,
        isError: false,
        data: { id: testProject.id, ...testProjectRequiredFields },
    })
})

test("onCancel is invoked", async () => {
    const onCancelSpy = spy(() => null)
    expect(testProject.id).toBeDefined()
    render(
        <>
            {testProject.id && (
                <EditProjectForm
                    employees={[testEmployee, anotherTestEmployee]}
                    customers={[testCustomer, anotherTestCustomer]}
                    project={testProject}
                    onCancel={onCancelSpy}
                />
            )}
        </>
    )

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing when editing a project", async () => {
    const submitTimeout = 100
    expect(testProject.id).toBeDefined()
    for (const field of Object.keys(testProjectRequiredFields).filter(
        (key) => !["customer", "managingEmployee"].includes(key)
    )) {
        const form = render(
            <>
                {testProject.id && (
                    <EditProjectForm
                        employees={[testEmployee, anotherTestEmployee]}
                        customers={[testCustomer, anotherTestCustomer]}
                        project={testProject}
                    />
                )}
            </>
        )
        const projectMissingRequired = _.omit(testProjectAllFields, field)

        /* eslint-disable no-await-in-loop */
        await fillAndSubmitForm(projectMissingRequired as Project)
        await new Promise((resolve) =>
            setTimeout(() => resolve(null), submitTimeout)
        )
        /* eslint-enable */
        expect(pathSpy.callCount).toEqual(0)
        expect(bodySpy.callCount).toEqual(0)
        form.unmount()
    }
})
