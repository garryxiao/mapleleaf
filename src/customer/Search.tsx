import React from 'react'
import { useParams, useLocation, RouteComponentProps } from "react-router-dom"
import { UserStateContext, CustomerController, CustomerSearchModel, useDimensions, searchLayoutFormat, InfiniteTable, ISearchResult, CustomerSearchPersonItem } from 'etsoo-react'
import { MainContainer } from '../app/MainContainer';
import { makeStyles } from '@material-ui/core';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// Styles
const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: theme.spacing(3)
    }
}))

export default (props: RouteComponentProps) => {
    // Style
    const classes = useStyles()

    // URL query parameters
    const query = useQuery()

    // User state
    const { state: userState } = React.useContext(UserStateContext)

    // Controller, should be in the function main body
    const api = new CustomerController(userState, {})

    // Calculate dimensions
    const {ref, dimensions} = useDimensions<HTMLElement>(true)

    // Height
    const height = (dimensions?.height) || 0

    // Format header label
    const formatLabel = (results: ISearchResult<CustomerSearchPersonItem>) => {
        if(results.layouts) {
            searchLayoutFormat(results.layouts, (field: string) => {
                if(field === 'cid')
                    return 'Student #'
                else if(field === 'birthday')
                    return 'D.O.B'
                else if(field === 'entry_date')
                    return 'Offer Date'
                return null
            })
        }
    }

    // Load datal
    const loadItems = async (page: number, records: number) => {
        const conditions: CustomerSearchModel = { page, records }
        const results = await api.searchPersonItems(conditions)
        if(page == 1)
            formatLabel(results)
        return results
    }

    return (
        <MainContainer padding={0} ref={ref}>
            <InfiniteTable rowHeight={53} records={10} height={height} padding={1} loadItems={loadItems} selectable={true}/>
        </MainContainer>
    )
}