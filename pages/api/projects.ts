// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Project } from '@/lib/types/common';
import createProjects from '@/lib/mock/createProjects';

export default function handler(req: NextApiRequest, res: NextApiResponse<Project[]>) {
    const projects = createProjects(5);
    res.status(200).json(projects);
}
