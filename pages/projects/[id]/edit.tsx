import React from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import ProjectForm from '@/components/projects/NewProject/ProjectForm';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/dist/client/router';
import useData from '@/lib/hooks/useData';
import { CustomerDTO, EmployeeDTO, ProjectDTO } from '@/lib/types/dto';

const Edit: NextPage = () => {
    const { data: customers, isError: customerError, isLoading: customersLoading } = useData<CustomerDTO[]>('customer');
    const { data: employees, isError: employeeError, isLoading: employeesLoading } = useData<EmployeeDTO[]>('employee');
    const router = useRouter();
    const { id } = router.query;
    const { data: projects, isError, isLoading } = useData<ProjectDTO>(`project/${id}`);
    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                Edit project
            </Heading>
            {(customersLoading || employeesLoading) && <Loading></Loading>}
            {(customerError || employeeError) && (
                <ErrorAlert
                    title="Error loading data"
                    message="Could not load the required data from the server"
                ></ErrorAlert>
            )}
            {isLoading && <Loading></Loading>}
            {isError && <ErrorAlert title={isError.name} message={isError.name}></ErrorAlert>}
            <ProjectForm customers={customers} employees={employees} method="PUT" project={projects}></ProjectForm>
        </Layout>
    );
};

export default Edit;
