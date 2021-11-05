// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { components } from '@/lib/types/api';
import createEmployees from '@/lib/mock/createEmployees';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<components['schemas']['EmployeeDTO'][]>,
): void {
    const employees = createEmployees(5);
    res.status(200).json(employees);
}
