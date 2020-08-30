import React from 'react';
import * as Yup from 'yup';
import {
    StepperFormItemProps,
    MaskedInput,
    useFormValidator,
    RadioGroupField,
    StepperFormChild,
    ModuleCountryList,
    ApiModule
} from 'etsoo-react';
import { TextField, Grid, makeStyles } from '@material-ui/core';

// Styles
const useStyles = makeStyles((theme) => ({
    halfGrid: {
        '&>*': {
            width: '50%'
        },
        '&>*:first-child': {
            paddingRight: theme.spacing(2)
        }
    }
}));

// Form validation schema
const validationSchemas = Yup.object({
    lastName: Yup.string().required('Please enter the family name'),
    firstName: Yup.string()
        .required('Please enter the given name')
        .notOneOf(
            [Yup.ref('lastName'), null],
            'Given name and family name should be different'
        ),
    cid: Yup.string()
        .required('Please enter the student#')
        .matches(
            /^[A-Z]{2}-\d{4}-\d{4}$/gi,
            'The student # mush match IN-9999-9999 format'
        ),
    gender: Yup.string().required('Please choose the gender'),
    birthday: Yup.date().required('Please enter the B.O.D')
});

/**
 * Add page basic info
 */
function AddBasicInfo(props: StepperFormItemProps): JSX.Element {
    // Destruct
    const { formReady } = props;

    // Styles
    const classes = useStyles();

    // Form validator
    const {
        blurHandler,
        changeHandler,
        blurFormHandler,
        changeFormHandler,
        errors,
        texts,
        validateForm
    } = useFormValidator(validationSchemas, 'lastName');

    return (
        <StepperFormChild formReady={formReady} validateForm={validateForm}>
            <Grid container justify="space-around">
                <Grid item xs={12} sm={5} className={classes.halfGrid}>
                    <TextField
                        name="lastName"
                        required
                        error={errors('lastName')}
                        helperText={texts('lastName')}
                        onChange={changeHandler}
                        onBlur={blurHandler}
                        InputLabelProps={{
                            shrink: true
                        }}
                        label="Family name"
                    />
                    <TextField
                        name="firstName"
                        required
                        error={errors('firstName')}
                        helperText={texts('firstName')}
                        onChange={changeHandler}
                        onBlur={blurHandler}
                        InputLabelProps={{
                            shrink: true
                        }}
                        label="Given name(s)"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <MaskedInput
                        name="cid"
                        required
                        error={errors('cid')}
                        helperText={texts('cid')}
                        onChange={changeFormHandler}
                        onBlur={blurFormHandler}
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        mask="IN-9999-9999"
                        defaultValue="IN-1234-1234"
                        label="MLC Student #"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        type="date"
                        name="enter_date"
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        label="Date in Provisional Offer Letter"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        type="date"
                        name="loa"
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        label="Date in Official IRCC LOA"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <RadioGroupField
                        name="gender"
                        required
                        label="Gender"
                        items={[
                            { value: 'F', label: 'Female' },
                            { value: 'M', label: 'Male' }
                        ]}
                        error={errors('gender')}
                        helperText={texts('gender')}
                        onChange={changeFormHandler}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        type="date"
                        name="birthday"
                        error={errors('birthday')}
                        helperText={texts('birthday')}
                        onChange={changeFormHandler}
                        onBlur={blurHandler}
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        label="B.O.D"
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <ModuleCountryList
                        label="Citizenship"
                        name="country"
                        module={ApiModule.Customer}
                        onChange={(event, value, reason) =>
                            console.log(event, value, reason)
                        }
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TextField
                        name="street"
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        label="Address"
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <MaskedInput
                        name="postcode"
                        fullWidth
                        InputLabelProps={{
                            shrink: true
                        }}
                        mask="999999"
                        label="Postcode"
                    />
                </Grid>
            </Grid>
        </StepperFormChild>
    );
}

export default AddBasicInfo;
