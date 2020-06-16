import React from 'react'
import { ChangePasswordModel, UserStateContext, useFormValidator, UserLoginController } from 'etsoo-react'
import { TextField, Button } from '@material-ui/core'
import * as Yup from 'yup'
import { RouteComponentProps } from 'react-router-dom'
import { MainContainer } from '../app/MainContainer'
import { StyledForm } from '../app/StyledForm'

// Form validation schema
const validationSchemas = Yup.object({
  oldPassword: Yup.string()
    .required("Please enter your current password")
    .min(4, "Password must contain at least 4 characters"),
  newPassword: Yup.string()
    .required("Please enter your new password")
    .min(4, "Password must contain at least 4 characters")
    .notOneOf([Yup.ref('oldPassword'), null], "New password should be different"),
  rePassword: Yup.string()
    .required("Please repeat the new password")
    // oneOf([Yup.ref('newPassword'), null], "Passwords mush match") will fail
    // ref is not proper for reach validation, ref field value is not ready
    .oneOf([Yup.ref('newPassword'), null], "Passwords mush match")
})

const ChangePassword: React.FunctionComponent<RouteComponentProps> = (props) => {
    // Form validator
    const { blurHandler, changeHandler, blurFormHandler, changeFormHandler, errors, texts, updateResult, validateForm } = useFormValidator(validationSchemas, 'oldPassword')

    // State user
    const { state, dispatch } = React.useContext(UserStateContext)

    // Controller, should be in the function main body
    const api = new UserLoginController(state, { defaultLoading: true }, dispatch)

    // Submit form
    async function doSubmit(event: React.FormEvent<HTMLFormElement>) {
      // Prevent default action
      event.preventDefault()

      // Form JSON data
      let data = await validateForm(new FormData(event.currentTarget))
      if(data === null)
        return

      // Act
      const result = await api.changePassword(data as ChangePasswordModel)

      if(result.ok) {
        // Reminder
        api.singleton.report('Password changed successfully!', undefined, () => {
          // Back to home
          props.history.push('/main')
        })
      } else {
        updateResult(result)
      }
    }

    return (
        <MainContainer maxWidth="xs">
          <StyledForm onSubmit={doSubmit} autoComplete="off">
            <TextField
              type="password"
              fullWidth
              name="oldPassword"
              error={errors('oldPassword')}
              helperText={texts('oldPassword')}
              onChange={changeHandler}
              onBlur={blurHandler}
              required
              autoFocus
              InputLabelProps={{
                shrink: true
              }}
              label="Current password:" />
            <TextField
              type="password"
              fullWidth
              name="newPassword"
              error={errors('newPassword')}
              helperText={texts('newPassword')}
              onChange={changeFormHandler}
              onBlur={blurFormHandler}
              required
              InputLabelProps={{
                shrink: true
              }}
              label="New password:" />
            <TextField
              type="password"
              fullWidth
              name="rePassword"
              error={errors('rePassword')}
              helperText={texts('rePassword')}
              onChange={changeFormHandler}
              onBlur={blurFormHandler}
              required
              InputLabelProps={{
                shrink: true
              }}
              label="Repeat it:" />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </StyledForm>
        </MainContainer>
    )
}

export default ChangePassword