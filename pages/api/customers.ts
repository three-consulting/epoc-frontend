// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { components } from '@/lib/types/api';
import createCustomers from '@/lib/mock/createCustomers';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<components['schemas']['CustomerDTO'][]>,
): void {
    const customers = createCustomers(5);
    res.status(200).json(customers);
}
