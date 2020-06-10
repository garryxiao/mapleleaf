import React from 'react'
import { UserStateContext } from 'etsoo-react'

function Main() {
    // State user
    const { state, dispatch } = React.useContext(UserStateContext)

    // useEffect once
    React.useEffect(() => {
    }, [dispatch])

    return (
        <div style={{ textAlign: 'center', padding: '20px'}}>
            {state.name}
        </div>
    )
}

export default Main