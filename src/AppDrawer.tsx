import React from 'react'
import { Hidden, Drawer, List, ListItemText, ListItem, Divider, makeStyles, Theme, ListItemIcon } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import PeopleIcon from '@material-ui/icons/People'
import { Link } from 'react-router-dom'

/**
 * App drawer properties
 */
interface AppDrawerProps {
    /**
     * Drawer width
     */
    drawerWidth: number

    /**
     * Close handler
     */
    onClose: React.EventHandler<React.SyntheticEvent>

    /**
     * Is open
     */
    open?: boolean

    /**
     * Title
     */
    title?: string
}

// Custom style interface
interface ICustomStyle {
    drawerWidth: number
}

// Make styles
const useStyles = makeStyles<Theme, ICustomStyle>((theme) => ({
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: ({drawerWidth}) => `${drawerWidth}px`,
            flexShrink: 0
        }
    },
    list: {
        width: ({drawerWidth}) => `${drawerWidth}px`
    }
}))

/**
 * App drawer
 */
export const AppDrawer = ({ drawerWidth, onClose, open, title }: AppDrawerProps) => {
    // Style
    const classes = useStyles({drawerWidth: drawerWidth})

    // Menu items
    const menuItems = <List className={classes.list} onClick={onClose}>
        <ListItem><ListItemText primary={title} /></ListItem>
        <Divider />
        <ListItem button component={Link} to="/main">
            <ListItemIcon><HomeIcon/></ListItemIcon>
            <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/customer/search">
            <ListItemIcon><PeopleIcon/></ListItemIcon>
            <ListItemText primary="Students" />
        </ListItem>
    </List>

    return (
        <>
            <Hidden lgUp>
                <Drawer anchor="left" open={open} onClose={onClose}>
                    {menuItems}
                </Drawer>
            </Hidden>
            <Hidden mdDown>
                <nav className={classes.drawer}>
                    <Drawer anchor="left" variant="permanent">
                        {menuItems}
                    </Drawer>
                </nav>
            </Hidden>
        </>
    )
}