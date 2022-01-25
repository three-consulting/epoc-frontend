import { useUpdateTasks } from '@/lib/hooks/useTasks';
import { Project, Task } from '@/lib/types/apiTypes';
import { FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import ErrorAlert from '../common/ErrorAlert';

type TaskFields = Partial<Task> & { project: Project };

const validateTaskFields = (fields: TaskFields): Task => {
    const { name } = fields;
    if (name) {
        return {
            ...fields,
            name,
        };
    } else {
        throw 'Invalid task form: missing required fields';
    }
};

interface TaskFormProps {
    project: Project;
    projectId: number;
    onClose: () => void;
}

export function CreateTaskForm({ project, onClose }: TaskFormProps): JSX.Element {
    const [taskFields, setTaskFields] = useState<TaskFields>({
        project: project,
    });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { postTask } = useUpdateTasks();

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await postTask(validateTaskFields(taskFields));
            onClose();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    return (
        <>
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
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                    Submit
                </Button>
                <Button colorScheme="gray" onClick={onClose}>
                    Cancel
                </Button>
            </ModalFooter>
            {errorMessage ? (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            ) : null}
        </>
    );
}
