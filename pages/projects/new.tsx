import React from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import ProjectForm from '@/components/form/ProjectForm';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import useCustomers from '@/lib/hooks/useCustomers';
import useEmployees from '@/lib/hooks/useEmployees';

const New: NextPage = () => {
    const { customersResponse } = useCustomers();
    const { employeesResponse } = useEmployees();

    const errorMessage =
        (customersResponse.isError && customersResponse.errorMessage) ||
        (employeesResponse.isError && employeesResponse.errorMessage) ||
        '';

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                New project
            </Heading>
            {(customersResponse.isLoading || employeesResponse.isLoading) && <Loading />}
            {(customersResponse.isError || employeesResponse.isError) && (
                <ErrorAlert title={errorMessage} message={errorMessage} />
            )}
            {customersResponse.isSuccess && employeesResponse.isSuccess && (
                <ProjectForm
                    customers={customersResponse.data}
                    employees={employeesResponse.data}
                    project={undefined}
                    projectId={undefined}
                />
            )}
        </Layout>
    );
};

export default New;
