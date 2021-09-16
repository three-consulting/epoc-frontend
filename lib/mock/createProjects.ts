import faker from 'faker';
import { Project } from '../types/common';

const createProject = (): Project => {
    const project: Project = {
        id: faker.datatype.number(),
        managing_employee_id: faker.datatype.number(),
        client_id: faker.datatype.number(),
        name: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        start_date: faker.date.recent().toISOString(),
        end_date: faker.date.soon().toISOString(),
        created: faker.date.past().toISOString(),
        updated: faker.date.recent().toISOString(),
    };

    return project;
};

const createProjects = (numProjects: number): Project[] => {
    return Array.from({ length: numProjects }, createProject);
};

export default createProjects;
