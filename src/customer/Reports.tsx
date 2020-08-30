import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import { DomUtils, StorageUtils } from '@etsoo/shared';
import { CustomerController } from 'etsoo-react';
import { useTheme, Typography, Hidden } from '@material-ui/core';
import { MainContainer } from '../app/MainContainer';

/**
 * Report data interface
 */
interface IReportData {
    label: string;
}

function CustomerReports(props: RouteComponentProps): JSX.Element {
    // Destruct
    const { history } = props;

    // Theme
    const theme = useTheme();

    // Controller
    // useMemo to avoid recreation
    const api = React.useMemo(() => new CustomerController(), []);

    // Cache
    const cacheKey = DomUtils.getLocationKey('customer_reports');
    let cache = false;
    let reportData: IReportData[];
    if (history.action === 'POP') {
        reportData =
            StorageUtils.getSessionDataTyped<IReportData[]>(cacheKey) || [];
        cache = true;
    } else {
        reportData = [];
    }

    // Report data
    const [items, updateItems] = React.useState<IReportData[]>(reportData);

    // Onload
    // Dependencies on api should be very careful, is equal will be different
    // every update and cause endless loop
    // So memorized api or api.report is the correct solution
    // https://stackoverflow.com/questions/53070970/infinite-loop-in-useeffect
    React.useEffect(() => {
        if (!cache) {
            api.report<IReportData[]>('creation').then((results) => {
                if (results == null) {
                    return;
                }
                StorageUtils.cacheSessionData(cacheKey, results);
                updateItems(results);
            });
        }
    }, [api, cache, cacheKey]);

    return (
        <MainContainer padding={3}>
            <Typography>Student creation summary</Typography>
            <Hidden mdUp>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={items} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis dataKey="label" type="category" />
                        <XAxis type="number" />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="v"
                            layout="vertical"
                            name="This year"
                            stroke={theme.palette.primary.main}
                        />
                        <Line
                            type="monotone"
                            dataKey="lv"
                            layout="vertical"
                            name="Last year"
                            stroke={theme.palette.error.main}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Hidden>
            <Hidden smDown>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={items} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" type="category" />
                        <YAxis type="number" />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="v"
                            name="This year"
                            stroke={theme.palette.primary.main}
                        />
                        <Line
                            type="monotone"
                            dataKey="lv"
                            name="Last year"
                            stroke={theme.palette.error.main}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Hidden>
        </MainContainer>
    );
}

export default CustomerReports;
