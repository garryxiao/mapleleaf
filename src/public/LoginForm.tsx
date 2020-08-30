import React from 'react';
import {
    TextField,
    FormControlLabel,
    Button,
    makeStyles,
    Checkbox
} from '@material-ui/core';
import { useFormValidator, SubmitFormProps } from 'etsoo-react';
import * as Yup from 'yup';

// Styles
const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

// Form validation schema
const validationSchemas = Yup.object({
    // Lazy idea to distinguish number id or email address
    id: Yup.lazy<string | undefined>((value) => {
        if (value && value.indexOf('@') !== -1) {
            return Yup.string().email('Email address is invalid');
        }
        return Yup.string()
            .required('User id or email is required')
            .matches(/^\d+$/g, 'Number id is invalid');
    }),
    password: Yup.string()
        .required('Please enter your password')
        .min(4, 'Password must contain at least 4 characters'),
    // Format data type only
    save: Yup.boolean()
});

// Login form properties
export interface LoginFormProps extends SubmitFormProps {
    /**
     * Saved user id
     */
    savedUserId: string;
}

// Login form
function LoginForm(props: LoginFormProps) {
    // Destruct
    const { callback, savedUserId } = props;

    // Style
    const classes = useStyles();

    // Form validator
    const {
        blurHandler,
        changeHandler,
        errors,
        texts,
        updateResult,
        validateForm
    } = useFormValidator(validationSchemas, 'id');

    // User component ref
    const userRef = React.useRef<HTMLInputElement>();

    // Password component ref
    const passwordRef = React.useRef<HTMLInputElement>();

    // Login handler
    const doLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevent the default action
        event.preventDefault();

        // Collect form JSON data
        const data = await validateForm(new FormData(event.currentTarget));
        if (data == null) {
            return;
        }

        // Callback
        const result = await callback(data);
        if (result?.ok) updateResult(result);
    };

    // Onload
    React.useEffect(() => {
        if (userRef && userRef.current && savedUserId) {
            userRef.current.value = savedUserId;

            if (passwordRef && passwordRef.current) {
                // If id is ready, set focus on password component
                passwordRef.current.focus();
            }
        }
    }, [savedUserId]);

    return (
        <form className={classes.form} onSubmit={doLogin} noValidate>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="id"
                label="Id or Email"
                name="id"
                error={errors('id')}
                helperText={texts('id')}
                onChange={changeHandler}
                onBlur={blurHandler}
                autoComplete="email"
                autoFocus
                inputRef={userRef}
            />
            <TextField
                variant="outlined"
                margin="normal"
                type="password"
                required
                fullWidth
                name="password"
                error={errors('password')}
                helperText={texts('password')}
                onChange={changeHandler}
                onBlur={blurHandler}
                label="Password"
                id="password"
                autoComplete="current-password"
                inputRef={passwordRef}
            />
            <FormControlLabel
                control={<Checkbox name="save" value="true" color="primary" />}
                label="Remember me"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Sign In
            </Button>
        </form>
    );
}
export default LoginForm;
