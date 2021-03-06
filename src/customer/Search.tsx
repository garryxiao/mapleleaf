import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
    Typography,
    makeStyles,
    Card,
    CardHeader,
    CardContent,
    Avatar,
    Grid,
    CircularProgress
} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import { red } from '@material-ui/core/colors';
import { Utils, DataTypes } from '@etsoo/shared';
import {
    CustomerController,
    CustomerSearchModel,
    useDimensions,
    searchLayoutFormat,
    ISearchResult,
    CustomerSearchPersonItem,
    ListItemRendererProps,
    SearchPage
} from 'etsoo-react';
import { MainContainer } from '../app/MainContainer';

// Styles
const useStyles = makeStyles((theme) => ({
    tableRow: {
        padding: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1)
        }
    },
    bold: {
        paddingLeft: theme.spacing(1),
        fontWeight: 'bold'
    },
    total: {
        display: 'grid',
        gridTemplateColumns: '50% 50%'
    },
    totalCell: {
        fontWeight: 'bold'
    },
    card: {
        height: '100%'
    },
    cardContent: {
        paddingTop: 0
    },
    avatar: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        backgroundColor: red[500]
    },
    description: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical'
    }
}));

function Search(props: RouteComponentProps): JSX.Element {
    // Destruct
    const { history } = props;

    // Style
    const classes = useStyles();

    // Controller, should be in the function main body
    const api = React.useMemo(() => new CustomerController(), []);

    // Calculate dimensions
    const { ref, dimensions } = useDimensions<HTMLElement>(true, (d) => {
        if (d.height < 1) return false;
        return true;
    });

    // Read cache data
    const tryCache = history.action === 'POP';

    // Width & Height
    const width = dimensions?.width || 0;
    const height = dimensions?.height || 0;
    const md = width <= 960;

    // Format header label
    const formatLabel = (field: string): string => {
        switch (field) {
            case 'birthday':
                return 'D.O.B';
            case 'cid':
                return 'Student #';
            case 'entry_date':
                return 'Offer Date';
            default:
                return Utils.snakeNameToWord(field);
        }
    };

    // Format header labels
    const formatLabels = (
        results: ISearchResult<CustomerSearchPersonItem>
    ): void => {
        if (results.layouts) {
            searchLayoutFormat(results.layouts, formatLabel);
        }
    };

    // More actions
    const moreActions = [
        {
            label: 'Reports',
            action: '/customer/reports',
            icon: <BarChartIcon />
        }
    ];

    // Search parameters
    const [searchProps] = React.useState<DataTypes.DynamicData>({});

    // Load datal
    const loadItems = async (
        page: number,
        records: number,
        orderIndex?: number
    ) => {
        // Combine parameters
        const conditions: CustomerSearchModel = {
            ...searchProps,
            page,
            records,
            orderIndex
        };

        // Read results
        const results = await api.searchPersonItems(conditions);
        if (results == null) {
            return {} as ISearchResult<CustomerSearchPersonItem>;
        }

        // Custom label formatter
        if (page === 1) {
            formatLabels(results);
        }

        // Return to the infinite list
        return results;
    };

    // Mobile list item renderer
    const itemRenderer = md
        ? (
              itemProps: ListItemRendererProps,
              className: string,
              parentClasses: string[]
          ) => {
              // Change parent style
              parentClasses.splice(0, parentClasses.length);

              // parentClasses.splice(0, 1)
              parentClasses.push(classes.tableRow);

              // <Skeleton variant="text" animation="wave" />
              const data = itemProps.data as CustomerSearchPersonItem;
              if (data.loading) {
                  return <CircularProgress size={20} />;
              }

              return (
                  <Card className={classes.card}>
                      <CardHeader
                          avatar={
                              <Avatar className={classes.avatar}>
                                  {data.gender}
                              </Avatar>
                          }
                          title={data.name}
                          subheader={Utils.joinItems([
                              data.birthday
                                  ? data.birthday.toString()
                                  : undefined,
                              data.address
                          ])}
                      />
                      <CardContent className={classes.cardContent}>
                          <Grid container spacing={1}>
                              <Grid item xs={12} sm={6}>
                                  <Typography component="span">
                                      {formatLabel('cid')}:
                                  </Typography>
                                  <Typography
                                      component="span"
                                      className={classes.bold}
                                  >
                                      {data.cid}
                                  </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                  <Typography component="span">
                                      {formatLabel('entry_date')}:
                                  </Typography>
                                  <Typography
                                      component="span"
                                      className={classes.bold}
                                  >
                                      {data.entry_date}
                                  </Typography>
                              </Grid>
                              <Grid item>
                                  <Typography
                                      variant="body2"
                                      className={classes.description}
                                  >
                                      {data.description}
                                  </Typography>
                              </Grid>
                          </Grid>
                      </CardContent>
                  </Card>
              );
          }
        : undefined;

    // Add handler
    const onAddClick = () => {
        props.history.push('/customer/add');
    };

    // Item click handler, no action under md size
    const onItemClick = (
        event: React.MouseEvent,
        item?: CustomerSearchPersonItem
    ) => {
        if (item?.id) {
            history.push(`/customer/view/${item.id}`);
        }
    };

    return (
        <MainContainer padding={0} ref={ref}>
            <SearchPage
                height={height}
                itemRenderer={itemRenderer}
                loadItems={loadItems}
                moreActions={moreActions}
                onAddClick={onAddClick}
                onItemClick={onItemClick}
                padding={1}
                searchProps={searchProps}
                tryCache={tryCache}
                width={width}
            />
        </MainContainer>
    );
}

export default Search;
