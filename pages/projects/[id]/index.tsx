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
import { useSWRConfig } from 'swr';
import * as fetch from '@/lib/utils/fetch';
import TimesheetTable from '@/components/table/TimesheetTable';
import TaskTable from '@/components/table/TaskTable';
import { FormStatus } from '@/components/form/ProjectForm';
import { ProjectDTO, TimesheetDTO } from '@/lib/types/dto';
import { projectEndpointURL, taskEndpointURL } from '@/lib/const';

type StateType = {
    formStatus: FormStatus;
    errorMessage: string;
};

const Id: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data: project, isError, isLoading } = useData<ProjectDTO>(new URL(`${id}`, projectEndpointURL));
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState<StateType>({
        formStatus: FormStatus.IDLE,
        errorMessage: '',
    });
    const { mutate } = useSWRConfig();
    const {
        data: timesheets,
        isError: timesheetError,
        isLoading: timesheetLoading,
    } = useData<TimesheetDTO[]>(new URL(`${id}`, taskEndpointURL));

    const handleArchive = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (project) {
            setState({
                ...state,
                formStatus: FormStatus.LOADING,
            });
            try {
                await fetch.put(projectEndpointURL.toString(), { ...project, status: 'ARCHIVED' });
                mutate(`${projectEndpointURL}/${id}`);
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
                {isLoading && <Loading />}
                {isError && <ErrorAlert title={isError.name} message={isError.name} />}
                {project ? <ProjectDetail project={project} /> : <Box>Not found</Box>}
            </Flex>
            <Link key={`${id}`} href={`${id}/edit`}>
                <Button colorScheme="blue" marginTop="1rem">
                    Edit Project
                </Button>
            </Link>
            {project?.status !== 'ARCHIVED' && (
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
                    <ModalBody marginTop="1rem">{project?.name} has been archived.</ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {timesheetLoading && <Loading />}
            {timesheetError && <ErrorAlert title={timesheetError.name} message={timesheetError.name} />}
            <TimesheetTable timesheets={timesheets} project={project} />
            {project && <TaskTable project={project} />}
        </Layout>
    );
};

export default Id;
