import React from 'react';
import * as Yup from 'yup';
import {
    StepperFormItemProps,
    useFormValidator,
    StepperFormChild
} from 'etsoo-react';

// Form validation schema
const validationSchemas = Yup.object({});

/**
 * Add page parents info
 */
function AddParents(props: StepperFormItemProps): JSX.Element {
    // Destruct
    const { formReady } = props;

    // Form validator
    const { validateForm } = useFormValidator(validationSchemas, 'lastName');

    return (
        <StepperFormChild formReady={formReady} validateForm={validateForm} />
    );
}

export default AddParents;
