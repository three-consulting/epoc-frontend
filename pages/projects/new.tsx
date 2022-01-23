import React, { useCallback } from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import ProjectForm from '@/components/form/ProjectForm';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import useData from '@/lib/hooks/useData';
import { listCustomers, listEmployees } from '@/lib/utils/apiRequests';

const New: NextPage = () => {
    const customerRequest = useCallback(() => listCustomers(), []);
    const employeesRequest = useCallback(() => listEmployees(), []);
    const [customerResponse, refreshCustomers] = useData(customerRequest);
    const [employeesResponse] = useData(employeesRequest);
    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                New project
            </Heading>
            {(customerResponse.isLoading || employeesResponse.isLoading) && <Loading />}
            {(customerResponse.isError || employeesResponse.isError) && (
                <ErrorAlert title="Error loading data" message="Could not load the required data from the server" />
            )}
            {customerResponse.isSuccess && employeesResponse.isSuccess && (
                <ProjectForm
                    customers={customerResponse.data}
                    refreshCustomers={refreshCustomers}
                    employees={employeesResponse.data}
                    method="POST"
                    project={undefined}
                />
            )}
        </Layout>
    );
};

export default New;
