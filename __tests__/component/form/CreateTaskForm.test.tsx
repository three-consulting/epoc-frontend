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

const isTaskKeys = (keys: unknown): keys is (keyof Task)[] =>
    Array.isArray(keys) &&
    keys.every((key) =>
        [
            "id",
            "name",
            "description",
            "project",
            "created",
            "updated",
            "billable",
            "status",
        ].includes(key)
    )

const taskKeys = (task: Task): (keyof Task)[] => {
    const keys = Object.keys(task)
    return isTaskKeys(keys) ? keys : []
}
const isInputElement = (element: unknown): element is HTMLInputElement =>
    typeof element === "object" &&
    element !== null &&
    Object.hasOwn(element, "checked")

const fillAndSubmitForm = async (task: Task) => {
    fireEvent.change(screen.getByTestId("form-field-name"), {
        target: { value: task.name || "" },
    })

    fireEvent.change(screen.getByTestId("form-field-description"), {
        target: { value: task.description || "" },
    })

    const billableCheckbox = screen.getByTestId("form-field-billable")
    if (
        isInputElement(billableCheckbox) &&
        task.billable !== billableCheckbox.checked
    ) {
        fireEvent.click(billableCheckbox)
    }

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-submit"))
    )
}

const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]
const testRequestPath = (): object => pathSpy.getCalls()[0].args[0]

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
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            taskFieldMetadata
        ) && testRequestBody()
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
    expect(testRequestPath()).toStrictEqual(customerEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            taskFieldMetadata
        ) && testRequestBody()
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

test("a required field cannot be missing", async () => {
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
    const taskMissingRequired = Object.assign({}, testTaskAllFields)
    taskKeys(testTaskRequiredFields).forEach((key: keyof Task) => {
        if (taskMissingRequired[key]) {
            delete taskMissingRequired[key]
        }
    })
    await fillAndSubmitForm(taskMissingRequired)
    expect(bodySpy.callCount).toEqual(0)
    expect(pathSpy.callCount).toEqual(0)
    form.unmount()
})
