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
import useData from '@/lib/hooks/useData';
import { FormStatus } from '@/components/projects/NewProject/reducer';
import { useSWRConfig } from 'swr';
import * as fetch from '@/lib/utils/fetch';

type StateType = {
    formStatus: FormStatus;
    errorMessage: string;
    modalMessage: string;
};

const Id: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data: project, isError, isLoading } = useData<components['schemas']['ProjectDTO']>(`project/${id}`);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [state, setState] = useState<StateType>({
        formStatus: FormStatus.IDLE,
        errorMessage: '',
        modalMessage: '',
    });
    const url = `${process.env.NEXT_PUBLIC_API_URL}/project`;
    const { mutate } = useSWRConfig();

    const handleArchive = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (project?.status === 'ARCHIVED') {
            setState({
                ...state,
                modalMessage: `Project ${id} has already been archived.`,
            });
            onOpen();
        } else if (project) {
            const createProjectRequest: components['schemas']['ProjectDTO'] = {
                ...project,
                status: 'ARCHIVED',
            };
            setState({
                ...state,
                formStatus: FormStatus.LOADING,
            });
            try {
                await fetch.put(url, createProjectRequest);
                mutate(`${url}/${id}`);
                setState({
                    ...state,
                    formStatus: FormStatus.SUCCESS,
                    modalMessage: `Project ${id} has been archived.`,
                });
                onOpen();
            } catch (error) {
                setState({
                    formStatus: FormStatus.ERROR,
                    errorMessage: `${error}`,
                    modalMessage: 'Failed to archive project!',
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
                {isLoading && <Loading></Loading>}
                {isError && <ErrorAlert title={isError.name} message={isError.name}></ErrorAlert>}
                {project ? <ProjectDetail project={project} /> : <Box>Not found</Box>}
            </Flex>
            <Link key={`${id}`} href={`${id}/edit`}>
                <Button colorScheme="blue" marginTop="1rem">
                    Edit Project
                </Button>
            </Link>
            <Button colorScheme="teal" marginTop="1rem" marginLeft="0.5rem" onClick={handleArchive}>
                Archive Project
            </Button>
            {state.formStatus == 'ERROR' ? <ErrorAlert></ErrorAlert> : <Box></Box>}
            {state.formStatus == 'ERROR' ? <Box>{state.errorMessage}</Box> : <Box></Box>}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody marginTop="1rem">{state.modalMessage}</ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Layout>
    );
};

export default Id;
