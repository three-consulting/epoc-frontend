import React from 'react';
import type { NextPage } from 'next';
import { Box, Heading, Text, Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import Layout from '@/components/common/Layout';
import { useRouter } from 'next/dist/client/router';
import NewProjectForm from '@/components/projects/NewProject/NewProjectForm';
import useCustomers from '@/lib/hooks/useCustomers';
import useEmployees from '@/lib/hooks/useEmployees';

const New: NextPage = () => {
    const router = useRouter();
    const { customers, isLoading: customerLoading, isError: customerError } = useCustomers();
    const { employees, isLoading: employeeLoading, isError: employeeError } = useEmployees();

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                New project
            </Heading>
            <NewProjectForm customers={customers} employees={employees}></NewProjectForm>
        </Layout>
    );
};

export default New;
