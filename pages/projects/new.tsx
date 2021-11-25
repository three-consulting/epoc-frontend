import React from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import ProjectForm from '@/components/projects/NewProject/ProjectForm';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import useData from '@/lib/hooks/useData';
import { components } from '@/lib/types/api';

const New: NextPage = () => {
    const {
        data: customers,
        isError: customerError,
        isLoading: customersLoading,
    } = useData<components['schemas']['CustomerDTO'][]>('customer');
    const {
        data: employees,
        isError: employeeError,
        isLoading: employeesLoading,
    } = useData<components['schemas']['EmployeeDTO'][]>('employee');
    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                New project
            </Heading>
            {(customersLoading || employeesLoading) && <Loading></Loading>}
            {(customerError || employeeError) && (
                <ErrorAlert
                    title="Error loading data"
                    message="Could not load the required data from the server"
                ></ErrorAlert>
            )}
            <ProjectForm customers={customers} employees={employees} method="POST"></ProjectForm>
        </Layout>
    );
};

export default New;
