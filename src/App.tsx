import React, { useContext } from 'react';
import {
    Route,
    Switch,
    withRouter,
    matchPath,
    RouteComponentProps,
    RouteProps
} from 'react-router-dom';
import {
    PrivateRoute,
    UserStateContext,
    UserLoginController,
    useDimensions2
} from 'etsoo-react';

import { makeStyles, CssBaseline } from '@material-ui/core';

import CustomerAdd from './customer/Add';
import CustomerSearch from './customer/Search';
import CustomerView from './customer/View';
import CustomerReports from './customer/Reports';
import Login from './public/Login';
import Main from './main/Main';
import ChangePassword from './user/ChangePassword';
import { AppMenuBar } from './AppMenuBar';
import { AppDrawer, AppDrawerRef } from './AppDrawer';

// Drawer width
const drawerWidth = 220;

// Routers
const routers = [
    {
        component: ChangePassword,
        label: 'Change Password',
        path: '/user/changepassword'
    },
    {
        component: CustomerAdd,
        label: 'Add a student',
        path: '/customer/add'
    },
    {
        component: CustomerSearch,
        label: 'Students',
        path: '/customer/search',
        search: true
    },
    {
        component: CustomerView,
        label: 'View Student',
        path: '/customer/view/:id'
    },
    {
        component: CustomerReports,
        label: 'Reports',
        path: '/customer/reports'
    },
    {
        component: Main,
        label: 'Home',
        path: '/main',
        exact: true
    }
];

// Make style
const useStyles = makeStyles(() => ({
    root: {
        height: '100%'
    },
    main: {
        width: '100%',
        display: 'flex'
    },
    content: {
        width: '100%',
        height: '100%'
    }
}));

// Token refresh seed
let tokenRefreshSeed = 0;

// Clear token refresh
const clearTokenRefresh = () => {
    if (tokenRefreshSeed > 0) {
        clearInterval(tokenRefreshSeed);
        tokenRefreshSeed = 0;
    }
};

const App: React.FunctionComponent<RouteComponentProps> = ({ location }) => {
    // Style
    const classes = useStyles();

    // State user
    const { state, dispatch } = useContext(UserStateContext);

    // Authorized
    const authorized: boolean = state == null ? false : state.authorized;

    // Controller
    const api = React.useMemo(() => new UserLoginController(), []);

    // Token refresh
    if (authorized) {
        if (tokenRefreshSeed === 0) {
            tokenRefreshSeed = window.setInterval(() => {
                try {
                    api.refreshToken();
                } catch {
                    // No error handling
                }
            }, state.refreshSeconds * 1000);
        }
    } else {
        clearTokenRefresh();
    }

    // Calculate dimensions
    const { ref1, ref2, dimensions1, dimensions2 } = useDimensions2<
        HTMLElement,
        HTMLDivElement
    >(true);

    // Setup the actual pixel height
    const mainStyle = React.useMemo(() => {
        const height =
            dimensions1 && dimensions2
                ? dimensions2.height - dimensions1.height
                : 0;
        return { height };
    }, [dimensions1, dimensions2]);

    // Drawer ref
    const drawerRef = React.useRef<AppDrawerRef>(null);

    // Drawer
    const drawer = React.useMemo(
        () => (
            <AppDrawer
                drawerWidth={drawerWidth}
                title={state.organizationName}
                ref={drawerRef}
            />
        ),
        [state.organizationName]
    );

    // Open drawer callback
    const onDrawerOpen = () => {
        // eslint-disable-next-line no-unused-expressions
        drawerRef.current?.open();
    };

    // Appbar
    const appBar = React.useMemo(() => {
        // Signout
        const onSignout = async () => {
            api.singleton.showLoading();
            await api.signout(dispatch, true);
            api.singleton.hideLoading();
        };

        // Current router
        const router = routers.find((routerProps) =>
            matchPath(location.pathname, routerProps as RouteProps)
        );

        // Return menu bar
        return (
            <AppMenuBar
                drawerWidth={drawerWidth}
                pageTitle={router?.label}
                search={router?.search}
                userName={state.name}
                ref={ref1}
                onDrawerOpen={onDrawerOpen}
                onSignout={onSignout}
            />
        );
    }, [api, dispatch, state.name, location.pathname, ref1]);

    // Router switch, useMemo to avoid unnecessary rerenderer
    const routerSwitch = React.useMemo(
        () => (
            <Switch>
                {routers.map(({ label, ...rest }) => (
                    <PrivateRoute
                        key={label}
                        authorized={authorized}
                        {...(rest as RouteProps)}
                    />
                ))}
                <Route component={Login} />
            </Switch>
        ),
        [authorized]
    );

    // Return
    return (
        <div className={classes.root} ref={ref2}>
            {authorized && appBar}
            <div className={classes.main} style={mainStyle}>
                <CssBaseline />
                {authorized && drawer}
                <div className={classes.content}>{routerSwitch}</div>
            </div>
        </div>
    );
};

export default withRouter(App);
