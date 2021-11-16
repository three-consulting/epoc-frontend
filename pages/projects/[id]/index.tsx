import React from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import type { NextPage } from 'next';
import useProjects from '@/lib/hooks/useProjects';
import { useRouter } from 'next/dist/client/router';
import ProjectDetail from '@/components/projects/ProjectDetail';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';

const Id: NextPage = () => {
    const { projects, isError, isLoading } = useProjects();
    const router = useRouter();
    const { id } = router.query;
    const project = projects ? projects.find((x) => `${x.id}` === id) : null;
    const proj = {
        id: project?.id ? project.id : 0,
        client_id: project?.customer?.id ? project?.customer?.id : 0,
        managing_employee_id: project?.managingEmployee?.id ? project?.managingEmployee?.id : 0,
        name: project?.name ? project?.name : '',
        description: project?.description ? project?.description : '',
        start_date: project?.startDate ? project?.startDate : '',
        end_date: project?.endDate ? project?.endDate : '',
        created: project?.created ? project?.created : '',
        updated: project?.updated,
    };
    return (
        <Flex>
            {isLoading && <Loading></Loading>}
            {isError && <ErrorAlert title={isError.name} message={isError.name}></ErrorAlert>}
            {project ? <ProjectDetail project={proj} /> : <Box>Loading</Box>}
        </Flex>
    );
};

export default Id;
