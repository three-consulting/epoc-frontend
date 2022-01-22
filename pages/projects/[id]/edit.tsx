import React, { useMemo } from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import ProjectForm from '@/components/form/ProjectForm';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/dist/client/router';
import useData from '@/lib/hooks/useData';
import { getProject, listCustomers, listEmployees } from '@/lib/const';

type Props = {
    id: number;
};

function EditProjectForm({ id }: Props): JSX.Element {
    const customerRequest = useMemo(() => listCustomers(), []);
    const employeesRequest = useMemo(() => listEmployees(), []);
    const projectRequest = useMemo(() => getProject(id), []);

    const customerResponse = useData(customerRequest);
    const employeesResponse = useData(employeesRequest);
    const projectResponse = useData(projectRequest);

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                Edit project
            </Heading>
            {(customerResponse.isLoading || employeesResponse.isLoading || projectResponse.isLoading) && <Loading />}
            {(customerResponse.isError || employeesResponse.isError || projectResponse.isError) && (
                <ErrorAlert title="Error loading data" message="Could not load the required data from the server" />
            )}
            {customerResponse.isSuccess && employeesResponse.isSuccess && projectResponse.isSuccess && (
                <ProjectForm
                    customers={customerResponse.data}
                    employees={employeesResponse.data}
                    method="PUT"
                    project={projectResponse.data}
                />
            )}
        </Layout>
    );
}

const Edit: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string | undefined;
    return id ? <EditProjectForm id={Number(id)} /> : null;
};

export default Edit;
