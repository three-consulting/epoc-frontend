import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import type { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import ProjectDetail from '@/components/projects/ProjectDetail';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import Layout from '@/components/common/Layout';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import Link from 'next/link';
import { components } from '@/lib/types/api';
import { FormStatus } from '@/components/projects/NewProject/reducer';
import useSWR, { useSWRConfig } from 'swr';
import * as fetch from '@/lib/utils/fetch';
import TimesheetTable from '@/components/timesheets/TimesheetTable';
import TaskTable from '@/components/tasks/TaskTable';

type StateType = {
    formStatus: FormStatus;
    errorMessage: string;
};

const Id: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState<StateType>({
        formStatus: FormStatus.IDLE,
        errorMessage: '',
    });
    const url = `${process.env.NEXT_PUBLIC_API_URL}`;
    const { mutate } = useSWRConfig();

    const projectUrl = id ? new URL(`${url}/project/${id}`, process.env.NEXT_PUBLIC_API_URL) : undefined;

    const { data: project, error: projectError } = useSWR<components['schemas']['ProjectDTO'], Error>(
        projectUrl ? projectUrl.href : null,
        fetch.get,
    );
    const projectLoading = !project && !projectError;

    const timesheetUrl = id ? new URL(`${url}/timesheet`, process.env.NEXT_PUBLIC_API_URL) : undefined;
    if (timesheetUrl !== undefined) {
        timesheetUrl.search = new URLSearchParams({ projectId: `${id}` }).toString();
    }
    const { data: timesheets, error: timesheetError } = useSWR<components['schemas']['TimesheetDTO'][], Error>(
        timesheetUrl ? timesheetUrl.href : null,
        fetch.get,
    );
    const timesheetLoading = !timesheets && !timesheetError;

    const handleArchive = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (project) {
            const createProjectRequest: components['schemas']['ProjectDTO'] = {
                ...project,
                status: 'ARCHIVED',
            };
            setState({
                ...state,
                formStatus: FormStatus.LOADING,
            });
            try {
                await fetch.put(`${url}/project`, createProjectRequest);
                mutate(`${url}/project/${id}`);
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
                {projectLoading && <Loading></Loading>}
                {projectError && <ErrorAlert title={projectError.name} message={projectError.name}></ErrorAlert>}
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
            {state.formStatus == 'ERROR' ? <ErrorAlert></ErrorAlert> : <Box></Box>}
            {state.formStatus == 'ERROR' ? <Box>{state.errorMessage}</Box> : <Box></Box>}
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
            {timesheetLoading && <Loading></Loading>}
            {timesheetError && <ErrorAlert title={timesheetError.name} message={timesheetError.name}></ErrorAlert>}
            {timesheets && project && <TimesheetTable timesheets={timesheets} project={project} />}
            {project && <TaskTable project={project} />}
        </Layout>
    );
};

export default Id;
