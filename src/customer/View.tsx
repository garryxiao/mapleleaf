import React from 'react'
import { useParams } from "react-router-dom"

function Search() {
    const { id } = useParams();

    return (
        <h1>View page, id: {id}</h1>
    )
}

export default Search