import React, { useState } from 'react';
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
import * as fetch from '@/lib/utils/fetch';
import TimesheetTable from '@/components/table/TimesheetTable';
import { FormStatus } from '@/components/form/ProjectForm';
import { ProjectDTO, TimesheetDTO } from '@/lib/types/dto';
import { projectEndpointURL, projectIdEndpointURL, timesheetEndpointURL } from '@/lib/const';
import TaskTable from '@/components/table/TaskTable';

type StateType = {
    formStatus: FormStatus;
    errorMessage: string;
};

type Props = {
    id: string;
};

function InspectProjectForm({ id }: Props): JSX.Element {
    const projectRequest = useData<ProjectDTO>(projectIdEndpointURL(id));
    const timesheetRequest = useData<TimesheetDTO[]>(timesheetEndpointURL, { projectId: id });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState<StateType>({
        formStatus: FormStatus.IDLE,
        errorMessage: '',
    });
    const handleArchive = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (projectRequest?.data) {
            setState({
                ...state,
                formStatus: FormStatus.LOADING,
            });
            try {
                await fetch.put(projectEndpointURL.toString(), { ...projectRequest.data, status: 'ARCHIVED' });
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
                {projectRequest?.isLoading && <Loading />}
                {projectRequest?.isError && (
                    <ErrorAlert title={projectRequest.isError.name} message={projectRequest.isError.name} />
                )}
                {projectRequest?.data ? <ProjectDetail project={projectRequest.data} /> : <Box>Not found</Box>}
            </Flex>
            <Link key={`${id}`} href={`${id}/edit`}>
                <Button colorScheme="blue" marginTop="1rem">
                    Edit Project
                </Button>
            </Link>
            {projectRequest?.data?.status !== 'ARCHIVED' && (
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
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody marginTop="1rem">{projectRequest?.data?.name} has been archived.</ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {timesheetRequest?.isLoading && <Loading />}
            {timesheetRequest?.isError && (
                <ErrorAlert title={timesheetRequest.isError.name} message={timesheetRequest.isError.name} />
            )}
            {projectRequest?.data && timesheetRequest?.data && (
                <TimesheetTable timesheets={timesheetRequest.data} project={projectRequest.data} />
            )}
            {projectRequest?.data && <TaskTable project={projectRequest.data} />}
        </Layout>
    );
}

const Id: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    return id ? <InspectProjectForm id={id[0]} /> : null;
};

export default Id;
