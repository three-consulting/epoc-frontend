import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import sinon, { spy } from "sinon"
import { Task } from "@/lib/types/apiTypes"
import { ApiUpdateResponse } from "@/lib/types/hooks"
import { NEXT_PUBLIC_API_URL } from "@/lib/conf"
import {
    testProject,
    testTask,
    testTaskAllFields,
    testTaskRequiredFields,
} from "../../fixtures"
import { EditTaskForm } from "@/components/form/TaskForm"

import { taskFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const taskEndpointURL = `${NEXT_PUBLIC_API_URL}/task`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    put: async (path: string, body: object): Promise<ApiUpdateResponse<Task>> =>
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
const fillAndSubmitForm = async (task: Task) => {
    fireEvent.change(screen.getByTestId("form-field-name"), {
        target: { value: task.name || "" },
    })

    fireEvent.change(screen.getByTestId("form-field-description"), {
        target: { value: task.description || "" },
    })

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-submit"))
    )

    await waitFor(() =>
        fireEvent.click(screen.getByTestId("form-button-cancel"))
    )

    fireEvent.change(screen.getByTestId("form-field-billable"), {
        target: { value: task.billable || "" },
    })
}

const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]
const testRequestPath = (): object => pathSpy.getCalls()[0].args[0]

test("a task can be edited with required fields", async () => {
    expect(testTaskRequiredFields).toBeDefined()
    render(
        <>
            {testTask.id && (
                <EditTaskForm
                    project={testProject}
                    task={testTask}
                    projectId={1}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testTaskRequiredFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(taskEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            taskFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual({
        id: testTask.id,
        ...testTaskRequiredFields,
    })
})

test("a task can be edited with all fields", async () => {
    expect(testTask.id).toBeDefined()
    render(
        <>
            {testTask.id && (
                <EditTaskForm
                    project={testProject}
                    task={testTask}
                    projectId={1}
                />
            )}
        </>
    )
    await fillAndSubmitForm(testTaskAllFields)

    await waitFor(() => expect(bodySpy.callCount).toEqual(1))
    expect(testRequestPath()).toStrictEqual(taskEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            taskFieldMetadata
        ) && testRequestBody()
    ).toStrictEqual({
        id: testTask.id,
        ...testTaskAllFields,
    })
})

test("afterSubmit is invoked with the correct data", async () => {
    const afterSubmitSpy = spy((updateTaskResponse) => updateTaskResponse)
    expect(testTask.id).toBeDefined()
    render(
        <>
            {testTask.id && (
                <EditTaskForm
                    project={testProject}
                    task={testTask}
                    projectId={1}
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
        data: { id: testTask.id, ...testTaskRequiredFields },
    })
})

test("onCancel is invoked", async () => {
    const onCancelSpy = spy(() => null)
    expect(testTask.id).toBeDefined()
    render(
        <>
            {testTask.id && (
                <EditTaskForm
                    project={testProject}
                    task={testTask}
                    projectId={1}
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
    expect(testProject.id).toBeDefined()
    const form = render(
        <>
            {testProject.id && (
                <EditTaskForm
                    project={testProject}
                    projectId={testProject.id}
                    task={testTask}
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
