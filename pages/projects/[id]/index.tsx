import React, { useCallback, useState } from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import type { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import ProjectDetail from '@/components/detail/ProjectDetail';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import Layout from '@/components/common/Layout';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import Link from 'next/link';
import useData from '@/lib/hooks/useData';
import TimesheetTable from '@/components/table/TimesheetTable';
import { getProject, listEmployees, listTasks, listTimesheets, putProject } from '@/lib/utils/apiRequests';
import TaskTable from '@/components/table/TaskTable';

type Props = {
    projectId: number;
};

function InspectProjectForm({ projectId }: Props): JSX.Element {
    const projectRequest = useCallback(() => getProject(projectId), []);
    const taskRequest = useCallback(() => listTasks(projectId), []);
    const timesheetRequest = useCallback(() => listTimesheets(projectId), []);
    const employeesRequest = useCallback(() => listEmployees(), []);

    const [projectResponse] = useData(projectRequest);
    const [timesheetResponse, refreshTimesheets] = useData(timesheetRequest);
    const [employeesResponse] = useData(employeesRequest);
    const [taskResponse] = useData(taskRequest);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [errorMessage, setErrorMessage] = useState<string>('');

    const archiveProject = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (projectResponse.isSuccess) {
            try {
                await putProject({ ...projectResponse.data, status: 'ARCHIVED' });
                onOpen();
            } catch (error) {
                setErrorMessage(error.toString());
            }
        } else {
            setErrorMessage('Project failed to load.');
        }
    };

    return (
        <Layout>
            {errorMessage ? (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            ) : null}
            {projectResponse.isLoading && <Loading />}
            {projectResponse.isError && (
                <ErrorAlert title={projectResponse.errorMessage} message={projectResponse.errorMessage} />
            )}
            {projectResponse.isSuccess ? (
                <>
                    <Flex flexDirection="column">
                        <ProjectDetail project={projectResponse.data} />
                    </Flex>
                    <Link key={`${projectId}`} href={`${projectId}/edit`}>
                        <Button colorScheme="blue" marginTop="1rem">
                            Edit Project
                        </Button>
                    </Link>
                    {projectResponse.data.status !== 'ARCHIVED' && (
                        <Button colorScheme="teal" marginTop="1rem" marginLeft="0.5rem" onClick={archiveProject}>
                            Archive Project
                        </Button>
                    )}
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalBody marginTop="1rem">{projectResponse.data.name} has been archived.</ModalBody>

                            <ModalFooter>
                                <Button colorScheme="blue" onClick={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    {timesheetResponse.isLoading && <Loading />}
                    {timesheetResponse.isError && (
                        <ErrorAlert title={timesheetResponse.errorMessage} message={timesheetResponse.errorMessage} />
                    )}
                    {timesheetResponse.isSuccess && employeesResponse.isSuccess && (
                        <TimesheetTable
                            project={projectResponse.data}
                            timesheets={timesheetResponse.data}
                            refreshTimesheets={refreshTimesheets}
                            employees={employeesResponse.data}
                        />
                    )}
                    {taskResponse.isSuccess && <TaskTable project={projectResponse.data} tasks={taskResponse.data} />}
                </>
            ) : (
                <Box>Not found</Box>
            )}
        </Layout>
    );
}

const Id: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string | undefined;
    return id ? <InspectProjectForm projectId={parseInt(id)} /> : null;
};

export default Id;
