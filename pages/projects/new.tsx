import React from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import NewProjectForm from '@/components/projects/NewProject/NewProjectForm';
import useCustomers from '@/lib/hooks/useCustomers';
import useEmployees from '@/lib/hooks/useEmployees';
import ErrorAlert from '@/components/common/ErrorAlert';

const New: NextPage = () => {
    const { customers, isError: customerError } = useCustomers();
    const { employees, isError: employeeError } = useEmployees();

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                New project
            </Heading>
            {(customerError || employeeError) && (
                <ErrorAlert
                    title="Error loading data"
                    message="Could not load the required data from the server"
                ></ErrorAlert>
            )}
            <NewProjectForm customers={customers} employees={employees}></NewProjectForm>
        </Layout>
    );
};

export default New;
