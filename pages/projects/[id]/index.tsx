import React, { useMemo, useState } from 'react';
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
import { FormStatus } from '@/components/form/ProjectForm';
import { getProject, listTimesheets, putProject } from '@/lib/const';
import TaskTable from '@/components/table/TaskTable';

type StateType = {
    formStatus: FormStatus;
    errorMessage: string;
};

type Props = {
    projectId: number;
};

function InspectProjectForm({ projectId }: Props): JSX.Element {
    const projectRequest = useMemo(() => getProject(projectId), []);
    const timesheetRequest = useMemo(() => listTimesheets(projectId), []);

    const projectResponse = useData(projectRequest);
    const timesheetResponse = useData(timesheetRequest);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState<StateType>({
        formStatus: FormStatus.IDLE,
        errorMessage: '',
    });

    const handleArchive = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (projectResponse.isSuccess) {
            setState({
                ...state,
                formStatus: FormStatus.LOADING,
            });
            try {
                await putProject({ ...projectResponse.data, status: 'ARCHIVED' });
                setState({
                    ...state,
                    formStatus: FormStatus.SUCCESS,
                });
                onOpen();
            } catch (error) {
                setState({
                    formStatus: FormStatus.ERROR,
                    errorMessage: `${error}`,
                });
            }
        } else {
            setState({
                ...state,
                formStatus: FormStatus.ERROR,
                errorMessage: 'Project failed to load.',
            });
        }
    };

    return (
        <Layout>
            <Flex flexDirection="column">
                {projectResponse.isLoading && <Loading />}
                {projectResponse.isError && (
                    <ErrorAlert title={projectResponse.errorMessage} message={projectResponse.errorMessage} />
                )}
                {projectResponse.isSuccess ? <ProjectDetail project={projectResponse.data} /> : <Box>Not found</Box>}
            </Flex>
            <Link key={`${projectId}`} href={`${projectId}/edit`}>
                <Button colorScheme="blue" marginTop="1rem">
                    Edit Project
                </Button>
            </Link>
            {projectResponse.isSuccess && projectResponse.data.status !== 'ARCHIVED' && (
                <Button colorScheme="teal" marginTop="1rem" marginLeft="0.5rem" onClick={handleArchive}>
                    Archive Project
                </Button>
            )}
            {state.formStatus == 'ERROR' ? (
                <>
                    <ErrorAlert />
                    <Box>{state.errorMessage}</Box>
                </>
            ) : null}
            {projectResponse.isSuccess && (
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
            )}
            {timesheetResponse.isLoading && <Loading />}
            {timesheetResponse.isError && (
                <ErrorAlert title={timesheetResponse.errorMessage} message={timesheetResponse.errorMessage} />
            )}
            {projectResponse.isSuccess && timesheetResponse.isSuccess && (
                <TimesheetTable timesheets={timesheetResponse.data} />
            )}
            {projectResponse.isSuccess && projectResponse.data.id && (
                <TaskTable project={projectResponse.data} projectId={projectResponse.data.id} />
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
