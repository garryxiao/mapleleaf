import React, { useContext } from 'react'
import { Route, Switch, withRouter, matchPath, RouteComponentProps } from 'react-router-dom'
import { PrivateRoute, UserStateContext, UserLoginController, useDimensions2 } from 'etsoo-react'

import CustomerAdd from './customer/Add'
import CustomerSearch from './customer/Search'
import CustomerView from './customer/View'
import Login from './public/Login'
import Main from './main/Main'
import { makeStyles, CssBaseline } from '@material-ui/core'
import ChangePassword from './user/ChangePassword'
import { AppMenuBar } from './AppMenuBar'
import { AppDrawer } from './AppDrawer'

// Drawer width
const drawerWidth = 220

// Routers
const routers = [
  { component: ChangePassword, label: 'Change Password', path: '/user/changepassword' },
  { component: CustomerAdd, label: 'Add a student', path: '/customer/add' },
  { component: CustomerSearch, label: 'Students', path: '/customer/search', search: true },
  { component: CustomerView, label: 'View Student', path: '/customer/view/:id' },
  { component: Main, label: 'Home', path: "/main", exact: true }
]

// Make style
const useStyles = makeStyles((theme) => (
  {
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
  }
))

// Token refresh seed
let tokenRefreshSeed: number = 0

const App: React.FunctionComponent<RouteComponentProps> = (props) => {
  // Style
  const classes = useStyles()

  // State user
  const { state, dispatch } = useContext(UserStateContext)

  // Authorized
  const authorized:boolean = (state == null ? false : state.authorized)

  // Controller
  const api = new UserLoginController(state, {}, dispatch)

  // Drawer state
  const [ drawerOpen, setDrawerOpen ] = React.useState(false)

  // Drawer open
  const onDrawerOpen = () => {
    setDrawerOpen(true)
  }

  // Drawer close
  const onDrawerClose = () => {
    setDrawerOpen(false)
  }

  // Signout
  const onSignout = async() => {
    api.singleton.showLoading()
    await api.signout(true)
    api.singleton.showLoading(false)
  }

  // Clear token refresh
  const clearTokenRefresh = () => {
    if (tokenRefreshSeed > 0) {
      clearInterval(tokenRefreshSeed)
      tokenRefreshSeed = 0
    }
  }

  // Token refresh
  if(authorized) {
    if(tokenRefreshSeed === 0) {
      tokenRefreshSeed = window.setInterval(() => {
        try {
          api.refreshToken()
        } catch (error) {
          console.log(error)
        }
        
      }, state.refreshSeconds * 1000)
    }
  } else {
    clearTokenRefresh()
  }

  // Calculate dimensions
  const {ref1, ref2, dimensions1, dimensions2} = useDimensions2<HTMLElement, HTMLDivElement>(true)

  // Setup the actual pixel height
  const mainStyle = React.useMemo(() => {
    return {
      height: (dimensions1 && dimensions2 ? (dimensions2.height - dimensions1.height) : 0)
    }
  }, [dimensions1, dimensions2])

  // Life cycle
  React.useEffect(() => {
    return () => {
      clearTokenRefresh()
      api.signout(false)
    }
  }, [])

  // Appbar
  const appBar = React.useMemo(() => {
    // Current router
    const router = routers.find(router => matchPath(props.location.pathname, router))

    // Return menu bar
    return <AppMenuBar drawerWidth={drawerWidth} pageTitle={router?.label} search={router?.search} userName={state.name} ref={ref1} onDrawerOpen={onDrawerOpen} onSignout={onSignout}/>
  }, [state.name, props.location.pathname])

  // Drawer
  const drawer = React.useMemo(() => {
    return (
      <AppDrawer drawerWidth={drawerWidth} title={state.organizationName} onClose={onDrawerClose} open={drawerOpen}/>
    )
  }, [state, drawerOpen])

  // Router switch, useMemo to avoid unnecessary rerenderer
  const routerSwitch = React.useMemo(() => {
    return (
      <Switch>
          {routers.map(({label, search, ...rest}) =>
              <PrivateRoute key={label} authorized={authorized} {...rest} />
          )}
          <Route component={Login} />
      </Switch>
    )
  }, [authorized])

  // Return
  return (
    <div className={classes.root} ref={ref2}>
      {authorized && appBar}
      <div className={classes.main} style={mainStyle}>
        <CssBaseline />
        {authorized && drawer}
        <div className={classes.content}>
          {routerSwitch}
        </div>
      </div>
    </div>
  )
}

export default withRouter(App)