import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
    StepperFormItem,
    StepperForm,
    StepperFormActionCallback,
    StepperFormAction
} from 'etsoo-react';
import { Grid, Button } from '@material-ui/core';
import { DataTypes } from '@etsoo/shared';
import AddBasicInfo from './AddBasicInfo';
import AddParents from './AddParents';
import AddProgram from './AddProgram';

function CustomerAdd(props: RouteComponentProps): JSX.Element {
    // Steps
    const steps: StepperFormItem[] = [
        { label: 'Basic info', form: AddBasicInfo },
        { label: 'Parents', form: AddParents },
        { label: 'Program', form: AddProgram }
    ];

    // Form submit handler
    const submitHandler = (data: DataTypes.DynamicData): void => {
        console.log('ok');
    };

    // Create buttons
    const buttons = (
        callback: StepperFormActionCallback,
        last?: boolean
    ): JSX.Element => {
        if (last === false) {
            return (
                <Grid container justify="space-around">
                    <Grid item xs={5} sm={5}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={(): void =>
                                callback(StepperFormAction.Next)
                            }
                        >
                            Next
                        </Button>
                    </Grid>
                </Grid>
            );
        }

        return (
            <Grid container justify="space-around">
                <Grid item xs={5} sm={5}>
                    <Button
                        variant="contained"
                        color="default"
                        fullWidth
                        onClick={(): void =>
                            callback(StepperFormAction.Previous)
                        }
                    >
                        Previous
                    </Button>
                </Grid>
                <Grid item xs={5} sm={5}>
                    {last ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={(): void =>
                                callback(StepperFormAction.Submit)
                            }
                        >
                            Submit
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={(): void =>
                                callback(StepperFormAction.Next)
                            }
                        >
                            Next
                        </Button>
                    )}
                </Grid>
            </Grid>
        );
    };

    // Return components
    return (
        <StepperForm
            buttons={buttons}
            steps={steps}
            maxWidth="md"
            submitHandler={submitHandler}
            promptForExit="Are you sure you want to leave the page without saving the data you entered?"
        />
    );
}

export default CustomerAdd;
