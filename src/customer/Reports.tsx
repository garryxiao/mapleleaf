import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { UserStateContext, CustomerController, Utils } from 'etsoo-react'
import { useTheme, Typography, Hidden } from '@material-ui/core'
import { MainContainer } from '../app/MainContainer'
import { RouteComponentProps } from 'react-router-dom'

/**
 * Report data interface
 */
interface IReportData {
    label: string
}

function CustomerReports(props: RouteComponentProps) {
    // State user
    const { state: userState } = React.useContext(UserStateContext)

    // Theme
    const theme = useTheme()

    // Controller
    const api = new CustomerController(userState, {})

    // Cache
    const cacheKey = Utils.getLocationKey('customer_reports')
    let cache: boolean = false
    let reportData: IReportData[]
    if(props.history.action === 'POP') {
        reportData = Utils.cacheSessionDataParse<IReportData[]>(cacheKey) || []
        cache = true
    } else {
        reportData = []
    }

    // Report data
    const [items, updateItems] = React.useState<IReportData[]>(reportData)

    // Onload
    React.useEffect(() => {
        if(!cache) {
            api.report<IReportData[]>('creation').then(results => {
                Utils.cacheSessionData(results, cacheKey)
                updateItems(results)
            })
        }
    }, [cache])

    return (
        <MainContainer padding={3}>
            <Typography>Student creation summary</Typography>
            <Hidden mdUp>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={items} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis dataKey="label" type="category" />
                        <XAxis/>
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="v" layout="vertical" name="This year" stroke={theme.palette.primary.main} />
                        <Line type="monotone" dataKey="lv" layout="vertical" name="Last year" stroke={theme.palette.error.main} />
                    </LineChart>
                </ResponsiveContainer>
            </Hidden>
            <Hidden smDown>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={items} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="v" name="This year" stroke={theme.palette.primary.main} />
                        <Line type="monotone" dataKey="lv" name="Last year" stroke={theme.palette.error.main} />
                    </LineChart>
                </ResponsiveContainer>
            </Hidden>
        </MainContainer>
    )
}

export default CustomerReports