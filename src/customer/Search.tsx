import React from 'react'
import { RouteComponentProps } from "react-router-dom"
import { UserStateContext, CustomerController, CustomerSearchModel, useDimensions, searchLayoutFormat, InfiniteTable, ISearchResult, CustomerSearchPersonItem, ListItemRendererProps, SearchPageFabs, SearchPageFabsMethods, IDynamicData, InfiniteTableMethods, Utils } from 'etsoo-react'
import { MainContainer } from '../app/MainContainer'
import { Typography, makeStyles, Card, CardHeader, CardContent, Avatar, Grid, TableCell, CircularProgress } from '@material-ui/core'
import { red } from '@material-ui/core/colors'
import { LanguageStateContext } from '../app/Settings'

// Styles
const useStyles = makeStyles((theme) => ({
    tableRow: {
        padding: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1)
        }
    },
    bold: {
        paddingLeft: theme.spacing(1),
        fontWeight: 'bold'  
    },
    total: {
        display: 'grid',
        gridTemplateColumns: '50% 50%'
    },
    totalCell: {
        fontWeight: 'bold'
    },
    card: {
        height: '100%'
    },
    cardContent: {
        paddingTop: 0
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        backgroundColor: red[500]
    },
    description: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical'
    }
}))

export default (props: RouteComponentProps) => {
    // Style
    const classes = useStyles()

    // User state
    const { state: userState } = React.useContext(UserStateContext)

    // Controller, should be in the function main body
    const api = new CustomerController(userState, {})

    // Calculate dimensions
    const {ref, dimensions} = useDimensions<HTMLElement>(true)

    // Fabs reference
    const fabsRef = React.useRef<SearchPageFabsMethods>(null)

    // Width & Height
    const width = (dimensions?.width) || 0
    const height = (dimensions?.height) || 0

    // rowHeight
    const md = (width <= 960)
    const rowHeight = md ? 224 : 53

    // Hide header
    const hideHeader = md ? true : false

    // Scroller
    let scroller: HTMLElement | undefined = undefined

    // Clear cache
    let tableCurrent: InfiniteTableMethods | undefined  = undefined

    // Infinite table ref
    const tableRef = (current: InfiniteTableMethods) => {
        tableCurrent = current
    }

    // Search parameters
    const [ searchProps ] = React.useState<IDynamicData>({})

    // Format header labels
    const formatLabels = (results: ISearchResult<CustomerSearchPersonItem>) => {
        if(results.layouts) {
            searchLayoutFormat(results.layouts, formatLabel)
        }
    }

    // Format header label
    const formatLabel = (field: string) => {
        switch(field) {
            case 'birthday':
                return 'D.O.B'
            case 'cid':
                return 'Student #'
            case 'entry_date':
                return 'Offer Date'
            default:
                return Utils.snakeNameToWord(field)
        }
    }

    // Load datal
    const loadItems = async (page: number, records: number, orderIndex?: number) => {
        // Combine parameters
        const conditions: CustomerSearchModel = Object.assign({}, searchProps, { page, records, orderIndex })

        // Read results
        const results = await api.searchPersonItems(conditions)

        // Custom label formatter
        if(page === 1)
            formatLabels(results)

        // Return to the infinite list
        return results
    }

    // Item click handler
    const onItemClick = md ? undefined : (event: React.MouseEvent, item?: CustomerSearchPersonItem) => {
        if(item?.id)
            props.history.push(`/customer/view/${item.id}`)
    }

    // Add handler
    const onAddClick = (event: React.MouseEvent) => {
        props.history.push('/customer/add')
    }

    // Go top handler
    const onGoTopClick = (event: React.MouseEvent) => {
        if(scroller) {
            scroller.scrollTop = 0
        }
    }

    // More handler
    const onMoreClick = (event: React.MouseEvent) => {

    }

    // Scroll change handler
    const onScrollChange = (scrollerDiv: HTMLElement, vertical: boolean, zero: boolean) => {
        scroller = scrollerDiv
        fabsRef.current?.scollChange(!zero)
    }

    // Footer renderer
    const footerRenderer = md ? undefined : (props: ListItemRendererProps, className: string, parentClasses: string[]) => {
        if(md) {
            parentClasses.splice(0)
            parentClasses.push(classes.tableRow)

            if(props.records === 0) {
                return (
                    <Card className={classes.card}>
                        <CardContent>
                            <LanguageStateContext.Consumer>{value => value.state.labels['no_match']}</LanguageStateContext.Consumer>
                        </CardContent>
                    </Card>
                )
            } else {
                return (
                    <Card className={classes.card}>
                        <CardContent className={classes.total + ' ' + classes.totalCell}>
                            <div><LanguageStateContext.Consumer>{value => value.state.labels['total'] + ': '}</LanguageStateContext.Consumer></div>
                            <div style={{textAlign: 'right'}}>{props.records}</div>
                        </CardContent>
                    </Card>
                )
            }
        } else {
            if(props.records === 0) {
                return (
                    <TableCell
                        component="div"
                        className={className}
                        style={{textAlign: 'center'}}
                    >
                        <LanguageStateContext.Consumer>{value => value.state.labels['no_match']}</LanguageStateContext.Consumer>
                    </TableCell>
                )
            } else {
                parentClasses.push(classes.total)
                className += ' ' + classes.totalCell
                return (
                    <>
                        <TableCell
                            component="div"
                            className={className}
                        >
                            <LanguageStateContext.Consumer>{value => value.state.labels['total'] + ': '}</LanguageStateContext.Consumer>
                        </TableCell>
                        <TableCell
                            component="div"
                            className={className}
                            style={{textAlign: 'right'}}
                        >
                            {props.records}
                        </TableCell>
                    </>
                )
            }
        }
    }

    // Mobile list item renderer
    const itemRenderer = md ? (props: ListItemRendererProps, className: string, parentClasses: string[]) => {
        // Change parent style
        parentClasses.splice(0, parentClasses.length)
        // parentClasses.splice(0, 1)
        parentClasses.push(classes.tableRow)

        // <Skeleton variant="text" animation="wave" />
        const data = props.data! as CustomerSearchPersonItem
        if(data.loading) {
            return <CircularProgress size={20} />
        } else {
            return <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar className={classes.avatar}>{data.gender}</Avatar>
                    }
                    title={data.name}
                    subheader={Utils.joinItems(data.birthday ? data.birthday.toString() : undefined, data.address)}
                />
                <CardContent className={classes.cardContent}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                            <Typography component="span">{formatLabel('cid')}:</Typography>
                            <Typography component="span" className={classes.bold}>{data.cid}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography component="span">{formatLabel('entry_date')}:</Typography>
                            <Typography component="span" className={classes.bold}>{data.entry_date}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2" className={classes.description}>{data.description}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        }
    } : undefined

    // Search seed
    let searchSeed: number

    // Search data
    const searchData = () => {
        if(searchSeed > 0)
            window.clearTimeout(searchSeed)

        // Avoid unnecessary API calls
        searchSeed = window.setTimeout(() => {
            // Cache the keywords
            Utils.cacheSessionString(searchProps['sc'], Utils.getLocationKey('keyword'))

            // Reset and search
            tableCurrent?.reset()
        }, 360)
    }

    React.useEffect(() => {
        // Search bar input component
        const input = api.singleton.settings.searchInput

        // Search bar input event handler
        const onInput = (event: Event) => {
            searchProps['sc'] = input?.value
            searchData()
        }

        if(input) {
            // Get the cached keywords
            input.value = Utils.cacheSessionDataGet(Utils.getLocationKey('keyword')) || ''

            // Add the event handler
            input.addEventListener('input', onInput)
        }

        return () => {
            if(searchSeed > 0)
                window.clearTimeout(searchSeed)

            if(input) {
                // Remove the event handler
                input.removeEventListener('input', onInput)
            }

            tableCurrent?.clearCache()
        }
    })

    return (
        <MainContainer padding={0} ref={ref}>
            <InfiniteTable ref={tableRef} rowHeight={rowHeight} height={height} onItemClick={onItemClick} onScrollChange={onScrollChange} padding={1} hideHeader={hideHeader} sortable={true} loadItems={loadItems} footerRenderer={footerRenderer} itemRenderer={itemRenderer}/>
            <SearchPageFabs onAddClick={onAddClick} onGoTopClick={onGoTopClick} onMoreClick={onMoreClick} ref={fabsRef} />
        </MainContainer>
    )
}