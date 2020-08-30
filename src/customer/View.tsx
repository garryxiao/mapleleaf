import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { MainContainer } from '../app/MainContainer';

export default ({ match }: RouteComponentProps<{ id: string | undefined }>) => {
    // Parameters
    const { id } = match.params;

    // Return components
    return (
        <MainContainer>
            <h1>
                View page, id:
                {id}
            </h1>
        </MainContainer>
    );
};
