import React from 'react'
import { AppBar, Toolbar, Typography, Hidden, Button, MenuItem, IconButton, ListItemIcon, ListItemText, Menu, Divider, makeStyles, Theme } from "@material-ui/core"
import { Link } from 'react-router-dom'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/Menu'
import LockIcon from '@material-ui/icons/Lock'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { SearchBar } from 'etsoo-react'

// Make styles
const useStyles = makeStyles<Theme, ICustomStyle>((theme) => ({
    appBar: {
        [theme.breakpoints.up('lg')]: {
            width: ({drawerWidth}) => `calc(100% - ${drawerWidth}px)`,
            marginLeft: ({drawerWidth}) => `${drawerWidth}px`
        }
    },
    menuButton: {
        [theme.breakpoints.up('lg')]: {
          display: 'none',
        },
        marginRight: theme.spacing(0)
    },
    title: {
        flexGrow: 1
    },
}))

// Custom style interface
interface ICustomStyle {
    drawerWidth: number
}

/**
 * App menu bar properities
 */
export interface AppMenuBarProps {
    /**
     * Drawer width
     */
    drawerWidth: number

    /**
     * Drawer open handler
     */
    onDrawerOpen: React.MouseEventHandler

    /**
     * Signout handler
     */
    onSignout: React.MouseEventHandler

    /**
     * Page title
     */
    pageTitle?: string

    /**
     * Search bar
     */
    search?: boolean

    /**
     * User name
     */
    userName?: string
}

/**
 * App menu bar
 * @param props Properties
 */
export const AppMenuBar = React.forwardRef<any, AppMenuBarProps>(({ drawerWidth, onDrawerOpen, onSignout, pageTitle, search, userName }, ref) => {
    // Style
    const classes = useStyles({drawerWidth: drawerWidth})

    // Menu anchor element and update
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    // Is the menu opened
    const open = Boolean(anchorEl)

    // Title ref
    const titleRef = React.useRef<HTMLElement>(null)

    // Icon click for menu
    const menuIconHandler = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    // Close menu handler
    const closeMenuHandler = () => {
        setAnchorEl(null)
    }

    // Search bar focus handler
    const onBarFocus = () => {
        if(titleRef.current)
            titleRef.current.style.display = 'none'
    }

    // Search bar blur handler
    const onBarBlur = () => {
        if(titleRef.current)
            titleRef.current.style.display = 'block'
    }

    return (
        <AppBar position="sticky" className={classes.appBar} ref={ref}>
            <Toolbar>
                <IconButton className={classes.menuButton} edge="start" color="inherit" onClick={onDrawerOpen}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title} ref={titleRef} noWrap>
                    {pageTitle}
                </Typography>
                {search && (
                    <>
                        <Hidden smUp>
                            <SearchBar onFocus={onBarFocus} onBlur={onBarBlur} />
                        </Hidden>
                        <Hidden xsDown>
                            <SearchBar />
                        </Hidden>
                    </>
                    
                )}
                <div>
                    <Hidden xsDown>
                        <Button
                            variant="contained"
                            color="default"
                            size="small"
                            endIcon={<AccountCircle />}
                            onClick={menuIconHandler}
                        >
                            {userName}
                        </Button>
                    </Hidden>
                    <Hidden smUp>
                        <IconButton
                            color="inherit"
                            onClick={menuIconHandler}
                        >
                            <AccountCircle />
                        </IconButton>
                    </Hidden>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        keepMounted
                        open={open}
                        onClose={closeMenuHandler}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                    >
                        <MenuItem button component={Link} to="/user/changepassword" onClick={closeMenuHandler}>
                            <ListItemIcon>
                                <LockIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Change password" />
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={onSignout}>
                            <ListItemIcon>
                                <ExitToAppIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Sign out" />
                        </MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    )
})