import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import {
    makeStyles,
    ListItem,
    Grid,
    CircularProgress
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import grey from '@material-ui/core/colors/grey';
import { DomUtils, StorageUtils } from '@etsoo/shared';
import { ListPanel, UserLoginController } from 'etsoo-react';
import { MainContainer } from '../app/MainContainer';
import { LanguageStateContext } from '../app/Settings';

// Styles
const useStyles = makeStyles((theme) => ({
    listPanel: {},
    linkAdd: {
        paddingRight: theme.spacing(2)
    },
    listItem: {
        height: '48px',
        [theme.breakpoints.down('xs')]: {
            height: '63px'
        }
    },
    listDark: {},
    listLight: {
        backgroundColor: grey[100]
    },
    listDescription: {
        [theme.breakpoints.down('xs')]: {
            ...theme.typography.caption,
            paddingTop: '0!important'
        }
    }
}));

// Customers list
interface CustomerListItem {
    id: number;
    name: string;
    cid?: string;
    description?: string;
}

function Main(props: RouteComponentProps) {
    // Destruct
    const { history } = props;

    // Style
    const classes = useStyles();

    // Controller
    const api = React.useMemo(() => new UserLoginController(), []);

    // Labels
    const { state: L } = React.useContext(LanguageStateContext);

    // When back, keep data cache
    const cacheKey = DomUtils.getLocationKey('lastest_customers');
    let cache = false;
    let initCustomers: CustomerListItem[];
    if (history.action === 'POP') {
        initCustomers =
            StorageUtils.getSessionDataTyped<CustomerListItem[]>(cacheKey) ||
            [];
        cache = true;
    } else {
        initCustomers = Array(6).fill(undefined);
    }

    // Customers
    const [customers, updateCustomers] = React.useState<CustomerListItem[]>(
        initCustomers
    );

    // Load data
    const loadData = React.useCallback(() => {
        if (!cache) {
            // mapleleaf, app folder name suggested
            api.serviceSummary<{ customers: CustomerListItem[] }>(
                'mapleleaf'
            ).then((results) => {
                if (results == null) {
                    return;
                }
                StorageUtils.cacheSessionData(cacheKey, results.customers);
                updateCustomers(results.customers);
            });
        }
    }, [api, cache, cacheKey]);

    // Layout read
    React.useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <MainContainer padding={1}>
            <ListPanel
                className={classes.listPanel}
                items={customers}
                itemRenderer={(item: CustomerListItem, index: number) =>
                    item ? (
                        <ListItem
                            button
                            key={item.id}
                            component={Link}
                            to={`/customer/view/${item.id}`}
                            className={DomUtils.mergeClasses(
                                classes.listItem,
                                index % 2 === 0
                                    ? classes.listDark
                                    : classes.listLight
                            )}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    {item.name}
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    {item.cid}
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    className={classes.listDescription}
                                >
                                    {item.description}
                                </Grid>
                            </Grid>
                        </ListItem>
                    ) : (
                        <ListItem
                            key={index}
                            className={DomUtils.mergeClasses(
                                classes.listItem,
                                index % 2 === 0
                                    ? classes.listDark
                                    : classes.listLight
                            )}
                        >
                            <Grid container spacing={2}>
                                <Grid item>
                                    {index === 0 && (
                                        <CircularProgress size={12} />
                                    )}
                                </Grid>
                            </Grid>
                        </ListItem>
                    )
                }
                title="Latest students"
                moreElement={
                    <>
                        <Link to="/customer/add" className={classes.linkAdd}>
                            <PersonAddIcon />
                        </Link>
                        <Link to="/customer/search">{L.labels.more}</Link>
                    </>
                }
            />
        </MainContainer>
    );
}

export default Main;
