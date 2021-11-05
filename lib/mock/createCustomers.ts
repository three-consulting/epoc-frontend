import { components } from '@/lib/types/api';
import faker from 'faker';

faker.seed(4);

const createCustomer = (): components['schemas']['CustomerDTO'] => {
    const dateString = faker.date.recent().toISOString();

    const customer: components['schemas']['CustomerDTO'] = {
        id: faker.datatype.number(),
        name: faker.lorem.words(2),
        description: faker.lorem.sentence(),
        created: dateString,
        updated: dateString,
        enabled: true,
    };

    return customer;
};

const createCustomers = (numCustomers: number): components['schemas']['CustomerDTO'][] => {
    return Array.from({ length: numCustomers }, createCustomer);
};

export default createCustomers;
