import React from "react"
import { Container, makeStyles } from "@material-ui/core"

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

// Custom style
interface ICustomStyle {
    padding: number
}

// Styles
const useStyles = makeStyles<any, ICustomStyle>((theme) => ({
    paper: {
        padding: props => theme.spacing(props.padding),
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
export const MainContainer = React.forwardRef<HTMLElement, React.PropsWithChildren<MainContainerProps>>((props, ref) => {
    // Padding
    const padding = props.padding == null ? 3 : props.padding

    // Max width
    const maxWidth = props.maxWidth == null ? false : props.maxWidth

    // Style
    const classes = useStyles({padding: padding})

    return (
        <Container component="main" maxWidth={maxWidth} className={classes.paper} ref={ref}>
            {props.children}
        </Container>
    )
})