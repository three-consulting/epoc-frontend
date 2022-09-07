import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { CreateTaskForm } from "@/components/form/TaskForm"
import sinon, { spy } from "sinon"
import { Task } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testProject,
    testTaskAllFields,
    testTaskRequiredFields,
} from "../../fixtures"

// eslint-disable-next-line id-match, id-length
import _ from "lodash"
import { User } from "firebase/auth"
import { taskFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/task`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    post: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<Task>> =>
        (await pathSpy(path)) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const isInputElement = (element: unknown): element is HTMLInputElement =>
    typeof element === "object" &&
    element !== null &&
    Object.hasOwn(element, "checked")

const fillAndSubmitForm = async (task: Task) => {
    screen
        .getAllByTestId("form-field-name")
        .forEach((nameInput) =>
            fireEvent.change(nameInput, { target: { value: task.name || "" } })
        )

    screen
        .getAllByTestId("form-field-description")
        .forEach((descriptionInput) =>
            fireEvent.change(descriptionInput, {
                target: { value: task.description || "" },
            })
        )

    screen
        .getAllByTestId("form-field-billable")
        .forEach((billableCheckbox: HTMLElement) => {
            if (
                isInputElement(billableCheckbox) &&
                task.billable !== billableCheckbox.checked
            ) {
                fireEvent.click(billableCheckbox)
            }
        })

    await waitFor(() =>
        screen
            .getAllByTestId("form-button-submit")
            .forEach((submitButton) => fireEvent.click(submitButton))
    )
}

export const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]

test("a task with the required fields only can be submitted", async () => {
    expect(testProject.id).toBeDefined()
    render(
        <>
            {testProject.id && (
                <CreateTaskForm
                    project={testProject}
                    projectId={testProject.id}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testTaskRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            taskFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
    ).toStrictEqual(testTaskRequiredFields)
})

test("a task with all fields can be submitted", async () => {
    expect(testProject.id).toBeDefined()
    render(
        <>
            {testProject.id && (
                <CreateTaskForm
                    project={testProject}
                    projectId={testProject.id}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testTaskAllFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            taskFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
    ).toStrictEqual(testTaskAllFields)
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy((createTaskResponse) => createTaskResponse)
    expect(testProject.id).toBeDefined()
    render(
        <>
            {testProject.id && (
                <CreateTaskForm
                    project={testProject}
                    projectId={testProject.id}
                    afterSubmit={afterSubmitSpy}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testTaskRequiredFields)

    await waitFor(() => expect(afterSubmitSpy.callCount).toEqual(1))
    expect(afterSubmitSpy.getCalls()[0].args[0]).toStrictEqual({
        isSuccess: true,
        isError: false,
        data: testTaskRequiredFields,
    })
})

test("onCancel is invoked", async () => {
    const onCancelSpy = spy(() => null)
    expect(testProject.id).toBeDefined()
    render(
        <>
            {testProject.id && (
                <CreateTaskForm
                    project={testProject}
                    projectId={testProject.id}
                    onCancel={onCancelSpy}
                />
            )}
        </>
    )

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    await waitFor(() => expect(onCancelSpy.callCount).toEqual(1))
})

test("a required field cannot be missing", () => {
    expect(testProject.id).toBeDefined()
    Object.keys(testTaskRequiredFields)
        .filter((key) => !["project", "billable"].includes(key))
        .forEach((field) => {
            const form = render(
                <>
                    {testProject.id && (
                        <CreateTaskForm
                            project={testProject}
                            projectId={testProject.id}
                        />
                    )}
                </>
            )
            const taskMissingRequired = _.omit(testTaskAllFields, field)

            fillAndSubmitForm(taskMissingRequired as Task)
                .then(() => {
                    expect(bodySpy.callCount).toEqual(0)
                    expect(pathSpy.callCount).toEqual(0)
                })
                .finally(() => form.unmount())
        })
})
