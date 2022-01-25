import { useUpdateTasks } from '@/lib/hooks/useTasks';
import { Project, Task } from '@/lib/types/apiTypes';
import { FormBase } from '@/lib/types/forms';
import { FormControl, FormLabel, Input, FormErrorMessage, Button, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import ErrorAlert from '../common/ErrorAlert';

type TaskFields = Partial<Task> & { project: Project };

const validateTaskFields = (fields: TaskFields, projectId: number): Task => {
    const { name, project } = fields;
    if (name) {
        return {
            ...fields,
            project: { ...project, id: projectId },
            name,
        };
    } else {
        throw 'Invalid task form: missing required fields';
    }
};

type TaskFormProps = FormBase & {
    project: Project;
    projectId: number;
};

export function CreateTaskForm({ project, projectId, afterSubmit }: TaskFormProps): JSX.Element {
    const [taskFields, setTaskFields] = useState<TaskFields>({
        project: project,
    });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { postTask } = useUpdateTasks();

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await postTask(validateTaskFields(taskFields, projectId), () => {
                undefined;
            });
            afterSubmit && afterSubmit();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    return (
        <>
            <div style={{ padding: '20px' }}>
                <FormControl isInvalid={!taskFields.name} isRequired>
                    <FormLabel>Task Name</FormLabel>
                    <Input
                        placeholder="Task Name"
                        onChange={(e) =>
                            setTaskFields({
                                ...taskFields,
                                name: e.target.value,
                            })
                        }
                    />
                    <FormErrorMessage>Task name cannot be empty.</FormErrorMessage>
                </FormControl>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input
                        placeholder="Description"
                        onChange={(e) =>
                            setTaskFields({
                                ...taskFields,
                                description: e.target.value,
                            })
                        }
                    />
                </FormControl>
            </div>
            <div style={{ textAlign: 'right', padding: '20px' }}>
                <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                    Submit
                </Button>
                <Button colorScheme="gray" onClick={afterSubmit}>
                    Cancel
                </Button>
            </div>
            {errorMessage ? (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            ) : null}
        </>
    );
}
