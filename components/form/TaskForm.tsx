import { ProjectDTO, TaskDTO } from '@/lib/types/dto';
import { postTask } from '@/lib/utils/apiRequests';
import { FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import ErrorAlert from '../common/ErrorAlert';

type TaskFields = Partial<TaskDTO> & { project: ProjectDTO };

const validateTaskFields = (fields: TaskFields): TaskDTO => {
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
    project: ProjectDTO;
    onClose: () => void;
}

export function TaskForm({ project, onClose }: TaskFormProps): JSX.Element {
    const [taskFields, setTaskFields] = useState<TaskFields>({
        project: project,
    });
    const [errorMessage, setErrorMessage] = useState<string>('');
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
