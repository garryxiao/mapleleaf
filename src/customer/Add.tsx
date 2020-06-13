import React from 'react'
import { RouteComponentProps } from "react-router-dom"
import { MainContainer } from '../app/MainContainer'

export default (props: RouteComponentProps<{id: (string | undefined)}>) => {
    // Parameters

    // Return components
    return (
        <MainContainer>
            <h1>Add page</h1>
        </MainContainer>
    )
}