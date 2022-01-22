import React from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import ProjectForm from '@/components/form/ProjectForm';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/dist/client/router';
import useData from '@/lib/hooks/useData';
import { CustomerDTO, EmployeeDTO, ProjectDTO } from '@/lib/types/dto';
import { customerEndpointURL, employeeEndpointURL, projectIdEndpointURL } from '@/lib/const';

type Props = {
    id: string;
};

function EditProjectForm({ id }: Props): JSX.Element {
    const customerRequest = useData<CustomerDTO[]>(customerEndpointURL);
    const employeesRequest = useData<EmployeeDTO[]>(employeeEndpointURL);
    const projectRequest = useData<ProjectDTO>(projectIdEndpointURL(id));

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                Edit project
            </Heading>
            {(customerRequest.isLoading || employeesRequest.isLoading) && <Loading />}
            {(customerRequest.isError || employeesRequest.isError) && (
                <ErrorAlert title="Error loading data" message="Could not load the required data from the server" />
            )}
            {projectRequest?.isLoading && <Loading />}
            {projectRequest?.isError && (
                <ErrorAlert title={projectRequest.isError.name} message={projectRequest.isError.name} />
            )}
            {customerRequest.data && employeesRequest.data && (
                <ProjectForm
                    customers={customerRequest.data}
                    employees={employeesRequest.data}
                    method="PUT"
                    project={projectRequest?.data}
                />
            )}
        </Layout>
    );
}

const Edit: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    return id ? <EditProjectForm id={id[0]} /> : null;
};

export default Edit;
