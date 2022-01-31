import React from 'react';
import type { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import Layout from '@/components/common/Layout';
import ErrorAlert from '@/components/common/ErrorAlert';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/dist/client/router';
import { useTimesheetDetail } from '@/lib/hooks/useTimesheets';
import { EditTimesheetForm } from '@/components/form/TimesheetForm';
import { useEmployees } from '@/lib/hooks/useEmployees';

type Props = {
    timesheetId: number;
};

function EditTimesheetPage({ timesheetId }: Props): JSX.Element {
    const router = useRouter();

    const timesheetDetailResponse = useTimesheetDetail(timesheetId);
    const employeesResponse = useEmployees();

    const errorMessage =
        (timesheetDetailResponse.isError && timesheetDetailResponse.errorMessage) ||
        (employeesResponse.isError && employeesResponse.errorMessage) ||
        '';

    const redirectToTimesheetDetail = () => router.push(`/timesheet/${timesheetId}`);

    return (
        <Layout>
            <Heading fontWeight="black" margin="1rem 0rem">
                Edit timesheet
            </Heading>
            {(timesheetDetailResponse.isLoading || employeesResponse.isLoading) && <Loading />}
            {(timesheetDetailResponse.isError || employeesResponse.isError) && (
                <ErrorAlert title={errorMessage} message={errorMessage} />
            )}
            {timesheetDetailResponse.isSuccess &&
                employeesResponse.isSuccess &&
                timesheetDetailResponse.data.id &&
                timesheetDetailResponse.data.project.id && (
                    <EditTimesheetForm
                        timesheet={timesheetDetailResponse.data}
                        timesheetId={timesheetDetailResponse.data.id}
                        project={timesheetDetailResponse.data.project}
                        projectId={timesheetDetailResponse.data.project.id}
                        employees={employeesResponse.data}
                        afterSubmit={redirectToTimesheetDetail}
                        onCancel={redirectToTimesheetDetail}
                    />
                )}
        </Layout>
    );
}

const Edit: NextPage = () => {
    const router = useRouter();
    const id = router.query.id as string | undefined;
    return id ? <EditTimesheetPage timesheetId={Number(id)} /> : null;
};

export default Edit;
