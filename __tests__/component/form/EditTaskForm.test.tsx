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
import { User } from "firebase/auth"
import { EditTaskForm } from "@/components/form/TaskForm"
// eslint-disable-next-line id-length, id-match
import _ from "lodash"
import { taskFieldMetadata } from "@/lib/types/typeMetadata"
import { checkTestRequestBodyRequiredFields } from "../../util"

const taskEndpointURL = `${NEXT_PUBLIC_API_URL}/task`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    put: async (
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

export const testRequestBody = (): object => bodySpy.getCalls()[0].args[0]

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
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(taskEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            taskFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
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
    expect(pathSpy.getCalls()[0].args[0]).toStrictEqual(taskEndpointURL)
    expect(
        checkTestRequestBodyRequiredFields(
            testRequestBody(),
            taskFieldMetadata
        ) && bodySpy.getCalls()[0].args[0]
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

test("a required field cannot be missing", () => {
    expect(testProject.id).toBeDefined()
    Object.keys(testTaskRequiredFields)
        .filter((key) => !["project", "billable"].includes(key))
        .forEach((field) => {
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
            const taskMissingRequired = _.omit(testTaskAllFields, field)

            fillAndSubmitForm(taskMissingRequired as Task)
                .then(() => {
                    expect(pathSpy.callCount).toEqual(0)
                    expect(bodySpy.callCount).toEqual(0)
                })
                .finally(() => form.unmount())
        })
})
