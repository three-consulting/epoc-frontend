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
import { projectFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const projectEndpointURL = `${NEXT_PUBLIC_API_URL}/project`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    put: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<Project>> =>
        (await pathSpy(path)) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const fillAndSubmitForm = async (project: Project) => {
    screen.getAllByTestId("form-field-name").forEach((nameInput) =>
        fireEvent.change(nameInput, {
            target: { value: project.name || "" },
        })
    )

    screen
        .getAllByTestId("form-field-description")
        .forEach((descriptionInput) =>
            fireEvent.change(descriptionInput, {
                target: { value: project.description || "" },
            })
        )

    screen.getAllByTestId("form-field-start-date").forEach((startDateInput) =>
        fireEvent.change(startDateInput, {
            target: { value: project.startDate || "" },
        })
    )

    screen.getAllByTestId("form-field-end-date").forEach((endDateInput) =>
        fireEvent.change(endDateInput, {
            target: { value: project.endDate || "" },
        })
    )

    if (project.customer) {
        screen.getAllByTestId("form-field-customer").forEach((customerInput) =>
            fireEvent.change(customerInput, {
                target: { value: project.customer.id },
            })
        )
    }

    if (project.managingEmployee) {
        screen
            .getAllByTestId("form-field-managing-employee")
            .forEach((managingEmployeeInput) =>
                fireEvent.change(managingEmployeeInput, {
                    target: { value: project.managingEmployee.id },
                })
            )
    }

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-submit"))
    )
}

export const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]

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
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            projectFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
    ).toStrictEqual({
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
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            projectFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
    ).toStrictEqual({
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

test("a required field cannot be missing when editing a project", () => {
    expect(testProject.id).toBeDefined()
    Object.keys(testProjectRequiredFields)
        .filter((key) => !["customer", "managingEmployee"].includes(key))
        .forEach((field) => {
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

            fillAndSubmitForm(projectMissingRequired as Project)
                .then(() => {
                    expect(pathSpy.callCount).toEqual(0)
                    expect(bodySpy.callCount).toEqual(0)
                })
                .finally(() => form.unmount())
        })
})
