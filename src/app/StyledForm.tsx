import React, { FormEventHandler } from 'react'
import { makeStyles } from "@material-ui/core"

/**
 * Styled form properties
 */
export interface StyledFormProps {
    /**
     * Form auto complete
     */
    autoComplete?: 'on' | 'off'

    /**
     * On submit event handler
     */
    onSubmit?: FormEventHandler
}

// Styles
const useStyles = makeStyles((theme) => ({
    form: {
      width: '100%', // Fix IE 11 issue.
      '& .MuiTextField-root': {
        marginBottom: theme.spacing(3)
      }
    }
}))

/**
 * Styled form
 * @param props Properties
 */
export const StyledForm: React.FunctionComponent<StyledFormProps> = (props) => {
    // Style
    const classes = useStyles()

    return (
        <form className={classes.form} onSubmit={props.onSubmit} noValidate autoComplete={props.autoComplete || 'on'}>
            {props.children}
        </form>
    )
}