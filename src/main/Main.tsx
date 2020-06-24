import React from 'react'
import { UserStateContext, ListPanel, UserLoginController, Utils } from 'etsoo-react'
import { MainContainer } from '../app/MainContainer'
import { Link, RouteComponentProps } from 'react-router-dom'
import { LanguageStateContext } from '../app/Settings'
import { makeStyles, ListItem, Grid, CircularProgress } from '@material-ui/core'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import grey from '@material-ui/core/colors/grey'

// Styles
const useStyles = makeStyles((theme) => ({
    listPanel: {
    },
    linkAdd: {
        paddingRight: theme.spacing(2)
    },
    listItem: {
        height: '48px',
        [theme.breakpoints.down('xs')]: {
            height: '63px'
        }
    },
    listDark: {

    },
    listLight: {
        backgroundColor: grey[100]
    },
    listDescription: {
        [theme.breakpoints.down('xs')]: {
            ...theme.typography.caption,
            paddingTop: '0!important'
        }
    }
}))

// Customers list
interface CustomerListItem {
    id: number
    name: string
    cid?: string
    description?: string
}

function Main(props: RouteComponentProps) {
    // Style
    const classes = useStyles()

    // State user
    const { state: userState, dispatch: userDispatch } = React.useContext(UserStateContext)

    // Controller
    const api = new UserLoginController(userState, {}, userDispatch)

    // Labels
    const { state: L } = React.useContext(LanguageStateContext)

    // When back, keep data cache
    const cacheKey = Utils.getLocationKey('lastest_customers')
    let cache: boolean = false
    let initCustomers: CustomerListItem[]
    if(props.history.action === 'POP') {
        initCustomers = Utils.cacheSessionDataParse<CustomerListItem[]>(cacheKey) || []
        cache = true
    } else {
        initCustomers = Array(6).fill(undefined)
    }

    // Customers
    const [customers, updateCustomers] = React.useState<CustomerListItem[]>(initCustomers)

    // Layout read
    React.useEffect(() => {
        if(!cache) {
            // mapleleaf, app folder name suggested
            api.serviceSummary<{ customers: CustomerListItem[] }>('mapleleaf').then(results => {
                Utils.cacheSessionData(results.customers, cacheKey)
                updateCustomers(results.customers)
            })
        }
    }, [])

    return (
        <MainContainer padding={1}>
            <ListPanel
                className={classes.listPanel}
                items={customers}
                itemRenderer={(item: CustomerListItem, index: number) => (
                    item ? <ListItem button key={item.id} component={Link} to={`/customer/view/${item.id}`} className={classes.listItem + ' ' + (index%2 === 0 ? classes.listDark : classes.listLight)}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>{item.name}</Grid>
                            <Grid item xs={6} sm={3}>{item.cid}</Grid>
                            <Grid item xs={12} sm={6} className={classes.listDescription}>{item.description}</Grid>
                        </Grid>
                    </ListItem> : <ListItem key={index} className={classes.listItem + ' ' + (index%2 === 0 ? classes.listDark : classes.listLight)}>
                        <Grid container spacing={2}><Grid item>{index === 0 && <CircularProgress size={12} />}</Grid></Grid>
                    </ListItem>
                )}
                title="Latest students"
                moreElement={<><Link to="/customer/add" className={classes.linkAdd}><PersonAddIcon /></Link> <Link to="/customer/search">{L.labels['more']}</Link></>}
            />
        </MainContainer>
    )
}

export default Main