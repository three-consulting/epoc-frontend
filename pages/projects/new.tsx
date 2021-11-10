import React from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import NewProjectForm from '@/components/projects/NewProject/NewProjectForm';
import useCustomers from '@/lib/hooks/useCustomers';
import useEmployees from '@/lib/hooks/useEmployees';

const New: NextPage = () => {
    const { customers } = useCustomers();
    const { employees } = useEmployees();

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
