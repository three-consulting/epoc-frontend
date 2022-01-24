import React from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import ProjectForm from '@/components/form/ProjectForm';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/dist/client/router';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { useEmployees } from '@/lib/hooks/useEmployees';
import { useProjectDetail } from '@/lib/hooks/useProjects';

type Props = {
    id: number;
};

function EditProjectPage({ id }: Props): JSX.Element {
    const { customersResponse } = useCustomers();
    const { employeesResponse } = useEmployees();
    const { projectDetailResponse } = useProjectDetail(id);

    const errorMessage =
        (customersResponse.isError && customersResponse.errorMessage) ||
        (employeesResponse.isError && employeesResponse.errorMessage) ||
        (projectDetailResponse.isError && projectDetailResponse.errorMessage) ||
        '';

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                Edit project
            </Heading>
            {(customersResponse.isLoading || employeesResponse.isLoading || projectDetailResponse.isLoading) && (
                <Loading />
            )}
            {(customersResponse.isError || employeesResponse.isError || projectDetailResponse.isError) && (
                <ErrorAlert title={errorMessage} message={errorMessage} />
            )}
            {customersResponse.isSuccess &&
                employeesResponse.isSuccess &&
                projectDetailResponse.isSuccess &&
                projectDetailResponse.data.id && (
                    <ProjectForm
                        customers={customersResponse.data}
                        employees={employeesResponse.data}
                        project={projectDetailResponse.data}
                        projectId={projectDetailResponse.data.id}
                    />
                )}
        </Layout>
    );
}

const Edit: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string | undefined;
    return id ? <EditProjectPage id={Number(id)} /> : null;
};

export default Edit;
