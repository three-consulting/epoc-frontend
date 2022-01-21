import React from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import ProjectForm from '@/components/form/ProjectForm';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import useData from '@/lib/hooks/useData';
import { CustomerDTO, EmployeeDTO } from '@/lib/types/dto';
import { customerEndpointURL, employeeEndpointURL } from '@/lib/const';

const New: NextPage = () => {
    const customerRequest = useData<CustomerDTO[]>(customerEndpointURL);
    const employeesRequest = useData<EmployeeDTO[]>(employeeEndpointURL);
    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                New project
            </Heading>
            {(customerRequest.isLoading || employeesRequest.isLoading) && <Loading />}
            {(customerRequest.isError || employeesRequest.isError) && (
                <ErrorAlert title="Error loading data" message="Could not load the required data from the server" />
            )}
            {customerRequest.data && employeesRequest.data && (
                <ProjectForm customers={customerRequest.data} employees={employeesRequest.data} method="POST" />
            )}
        </Layout>
    );
};

export default New;
