import React from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import ProjectForm from '@/components/projects/NewProject/ProjectForm';
import useCustomers from '@/lib/hooks/useCustomers';
import useEmployees from '@/lib/hooks/useEmployees';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';

const Edit: NextPage = () => {
    const { customers, isError: customerError, isLoading: customersLoading } = useCustomers();
    const { employees, isError: employeeError, isLoading: employeesLoading } = useEmployees();

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
            <ProjectForm customers={customers} employees={employees} method="PUT"></ProjectForm>
        </Layout>
    );
};

export default Edit;
