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

const taskEndpointURL = `${NEXT_PUBLIC_API_URL}/task`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    // eslint-disable-next-line require-await
    put: async (
        path: string,
        _user: User,
        body: object
    ): Promise<ApiUpdateResponse<Task>> => pathSpy(path) && bodySpy(body),
}))

afterEach(() => {
    bodySpy.resetHistory()
    pathSpy.resetHistory()
})

const fillAndSubmitForm = async (task: Task) => {
    const nameInput = screen.getByTestId("form-field-name")
    fireEvent.change(nameInput, { target: { value: task.name || "" } })

    const descriptionInput = screen.getByTestId("form-field-description")
    fireEvent.change(descriptionInput, {
        target: { value: task.description || "" },
    })

    const submitButton = screen.getByTestId("form-button-submit")
    await waitFor(() => fireEvent.click(submitButton))

    const cancelButton = screen.getByTestId("form-button-cancel")
    await waitFor(() => fireEvent.click(cancelButton))

    const billableInput = screen.getByTestId("form-field-billable")
    fireEvent.change(billableInput, { target: { value: task.billable || "" } })
}

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
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual({
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
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual({
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
    const submitTimeout = 100
    expect(testProject.id).toBeDefined()
    for (const field of Object.keys(testTaskRequiredFields).filter(
        (key) => !["project", "billable"].includes(key)
    )) {
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

        /* eslint-disable no-await-in-loop */
        await fillAndSubmitForm(taskMissingRequired as Task)
        await new Promise((resolve) =>
            setTimeout(() => resolve(null), submitTimeout)
        )
        /* eslint-enable */

        expect(pathSpy.callCount).toEqual(0)
        expect(bodySpy.callCount).toEqual(0)
        form.unmount()
    }
})
