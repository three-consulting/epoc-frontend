import { components } from '@/lib/types/api';
import faker from 'faker';

faker.seed(4);

const createEmployee = (): components['schemas']['EmployeeDTO'] => {
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const start_date = faker.date.recent().toISOString();

    const employee: components['schemas']['EmployeeDTO'] = {
        id: faker.datatype.number(),
        first_name: first_name,
        last_name: last_name,
        email: `${first_name}.${last_name}@acme.com`,
        start_date: start_date,
        created: start_date,
        updated: undefined,
    };

    return employee;
};

const createEmployees = (numEmpoyees: number): components['schemas']['EmployeeDTO'][] => {
    return Array.from({ length: numEmpoyees }, createEmployee);
};

export default createEmployees;
