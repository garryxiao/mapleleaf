import React from 'react'
import * as Yup from 'yup'
import { StepperFormItemProps, useFormValidator, StepperFormChild } from 'etsoo-react'

// Form validation schema
const validationSchemas = Yup.object({
})

/**
 * Add page program
 */
function AddProgram(props: StepperFormItemProps) {
   // Form validator
   const { validateForm } = useFormValidator(validationSchemas, 'lastName')

   // Submit form
   async function doSubmit(event: React.FormEvent<HTMLFormElement>) {
       // Prevent default action
       event.preventDefault()
 
       // Form JSON data
       let data = await validateForm(new FormData(event.currentTarget))
       if(data === null)
         return
   }
   
   return (
        <StepperFormChild formReady={props.formReady} validateForm={validateForm}>
        </StepperFormChild>
   )
}

export default AddProgram