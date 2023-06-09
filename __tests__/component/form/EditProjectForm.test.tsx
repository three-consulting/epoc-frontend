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

import { projectFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const projectEndpointURL = `${NEXT_PUBLIC_API_URL}/project`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    put: async (
        path: string,
        body: object
    ): Promise<ApiUpdateResponse<Project>> =>
        (await pathSpy(path)) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const isProjectKeys = (keys: unknown): keys is (keyof Project)[] =>
    Array.isArray(keys) &&
    keys.every((key) =>
        [
            "id",
            "name",
            "description",
            "startDate",
            "endDate",
            "customer",
            "managingEmployee",
            "status",
            "created",
            "updated",
        ].includes(key)
    )

const projectKeys = (project: Project): (keyof Project)[] => {
    const keys = Object.keys(project)
    return isProjectKeys(keys) ? keys : []
}

const fillAndSubmitForm = async (project: Project) => {
    fireEvent.change(screen.getByTestId("form-field-name"), {
        target: { value: project.name || "" },
    })

    fireEvent.change(screen.getByTestId("form-field-description"), {
        target: { value: project.description || "" },
    })

    fireEvent.change(screen.getByTestId("form-field-start-date"), {
        target: { value: project.startDate || "" },
    })

    fireEvent.change(screen.getByTestId("form-field-end-date"), {
        target: { value: project.endDate || "" },
    })

    if (project.customer) {
        fireEvent.change(screen.getByTestId("form-field-customer"), {
            target: { value: project.customer.id },
        })
    }

    if (project.managingEmployee) {
        fireEvent.change(screen.getByTestId("form-field-managing-employee"), {
            target: { value: project.managingEmployee.id },
        })
    }

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-submit"))
    )
}

const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]
const testRequestPath = (): object => pathSpy.getCalls()[0].args[0]

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
    expect(testRequestPath()).toStrictEqual(projectEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            projectFieldMetadata
        ) && testRequestBody()
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
    expect(testRequestPath()).toStrictEqual(projectEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            projectFieldMetadata
        ) && testRequestBody()
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

test("a required field cannot be missing when editing a project", async () => {
    expect(testProject.id).toBeDefined()
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
    const projectMissingRequired = Object.assign({}, testProjectAllFields)
    projectKeys(testProjectRequiredFields).forEach((key: keyof Project) => {
        if (projectMissingRequired[key]) {
            delete projectMissingRequired[key]
        }
    })
    await fillAndSubmitForm(projectMissingRequired)
    expect(bodySpy.callCount).toEqual(0)
    expect(pathSpy.callCount).toEqual(0)
    form.unmount()
})
