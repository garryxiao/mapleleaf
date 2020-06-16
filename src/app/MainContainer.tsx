import React from "react"
import { Container, makeStyles, Theme } from "@material-ui/core"

/**
 * Main container properties
 */
export interface MainContainerProps {
    /**
     * Max width
     */
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false

    /**
     * Padding
     */
    padding?: number
}

// Styles
const useStyles = makeStyles<Theme, {padding?: number}>((theme) => ({
    paper: {
        padding: props => theme.spacing(props.padding == null ? 3 : props.padding),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        height: '100%'  // Easy for calculation of dimensions
    }
}))

/**
 * Main container for the app
 * React.forwardRef forward the Container ref opt-in
 * @param props Properties
 */
export const MainContainer = React.forwardRef<HTMLElement, React.PropsWithChildren<MainContainerProps>>(({children, maxWidth, padding, ...rest}, ref) => {
    // Style
    const classes = useStyles({padding})

    return (
        <Container component="main" maxWidth={maxWidth == null ? false : maxWidth} className={classes.paper} ref={ref}>
            {children || <></>}
        </Container>
    )
})