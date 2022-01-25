import { FormControl, FormLabel, Input, Button, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Customer } from '@/lib/types/apiTypes';
import { useUpdateCustomers } from '@/lib/hooks/useCustomers';
import ErrorAlert from '../common/ErrorAlert';
import { FormBase } from '@/lib/types/forms';

type CustomerFields = Partial<Customer>;

const validateCustomerFields = (fields: CustomerFields): Customer => {
    const { name } = fields;
    if (name) {
        return { ...fields, name };
    } else {
        throw 'Invalid customer form: missing required fields';
    }
};

type CreateCustomerFormProps = FormBase;

export function CreateCustomerForm({ afterSubmit }: CreateCustomerFormProps): JSX.Element {
    const [customerFields, setCustomerFields] = useState<CustomerFields>({});
    const { postCustomer } = useUpdateCustomers();
    const [errorMessage, setErrorMessage] = useState<string>('');

    const onSubmit = async () => {
        try {
            await postCustomer(validateCustomerFields(customerFields));
            afterSubmit && afterSubmit();
        } catch (error) {
            setErrorMessage(`${error}`);
        }
    };

    return (
        <>
            <div style={{ padding: '20px' }}>
                <FormControl>
                    <FormLabel>Customer Name</FormLabel>
                    <Input
                        placeholder="Customer Name"
                        onChange={(e) =>
                            setCustomerFields({
                                ...customerFields,
                                name: e.target.value,
                            })
                        }
                    />
                </FormControl>

                <FormControl mt={4}>
                    <FormLabel>Description</FormLabel>
                    <Input
                        placeholder="Description"
                        onChange={(e) =>
                            setCustomerFields({
                                ...customerFields,
                                description: e.target.value,
                            })
                        }
                    />
                </FormControl>
            </div>
            <div style={{ textAlign: 'right', padding: '20px' }}>
                <Button colorScheme="blue" mr={3} onClick={onSubmit}>
                    Save
                </Button>
                <Button colorScheme="grey" variant="outline" onClick={() => null}>
                    Cancel
                </Button>
            </div>
            {errorMessage && (
                <>
                    <ErrorAlert />
                    <Box>{errorMessage}</Box>
                </>
            )}
        </>
    );
}

export default CreateCustomerFormProps;
