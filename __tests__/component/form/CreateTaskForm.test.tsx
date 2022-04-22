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

const customerEndpointURL = `${NEXT_PUBLIC_API_URL}/task`
const bodySpy = sinon.spy((body) => body)
const pathSpy = sinon.spy((path) => path)

jest.mock("@/lib/utils/fetch", () => ({
    // eslint-disable-next-line require-await
    post: async (
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

    const billableCheckbox = screen.getByTestId(
        "form-field-billable"
    ) as HTMLInputElement
    if (task.billable !== billableCheckbox.checked) {
        fireEvent.click(billableCheckbox)
    }

    const submitButton = screen.getByTestId("form-button-submit")
    await waitFor(() => fireEvent.click(submitButton))
}

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
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual(testTaskRequiredFields)
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
    expect(bodySpy.getCalls()[0].args[0]).toStrictEqual(testTaskAllFields)
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
    const submitTimeout = 100
    expect(testProject.id).toBeDefined()
    for (const field of Object.keys(testTaskRequiredFields).filter(
        (key) => !["project", "billable"].includes(key)
    )) {
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
