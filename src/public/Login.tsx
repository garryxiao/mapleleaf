import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
    Container,
    Avatar,
    Typography,
    Link,
    Box,
    makeStyles
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { DataTypes } from '@etsoo/shared';
import {
    PrivateRouteRedirectState,
    UserStateContext,
    LanguageAction,
    LoginModel,
    UserLoginController,
    IResult,
    LoginResultData,
    LoginTokenModel,
    UserLoginSuccess,
    IUserUpdate,
    IViewModel,
    SaveLogin,
    LanguageChooser,
    UserActionType,
    ApiSettings
} from 'etsoo-react';
import { Settings, LanguageStateContext } from '../app/Settings';
import LoginForm from './LoginForm';

// Styles
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    language: {
        marginLeft: 'calc(100% - 60px)',
        marginBottom: -60
    },
    logoContainer: {
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        height: 'auto',
        padding:
            '38.44% 0 0 0' /* 38.44% = 100 / (w / h) = 100 / (640 / 246) */,
        boxShadow: '3px 2px 2px #aaa'
    },
    logo: {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }
}));

// Login component
function Login(props: RouteComponentProps) {
    // Destruct
    const { location, history } = props;

    // User sate
    const { state, dispatch } = useContext(UserStateContext);

    // Controller, should be in the function main body
    const api = React.useMemo(() => new UserLoginController(), []);

    // Labels
    const { state: L, dispatch: languageDispatch } = useContext(
        LanguageStateContext
    );

    // Change language
    const closeLanguageChoose = (
        languageItem?: DataTypes.LanguageDefinition
    ) => {
        if (languageItem != null) {
            const action: LanguageAction = {
                name: languageItem.name,
                labels: languageItem.labels
            };
            languageDispatch(action);
        }
    };

    // Style
    const classes = useStyles();

    // Login success
    const loginSuccess: UserLoginSuccess = React.useCallback(
        (userId: number) =>
            api.viewF<IUserUpdate>(
                (data: IViewModel) => {
                    // Format data
                    const newData: IUserUpdate = {
                        name: data.name,
                        foreignName: data.foreign_name,
                        organizationName: data.organization_name
                    };

                    // Return
                    return newData;
                },
                userId,
                'simple'
            ),
        [api]
    );

    // Login result
    const loginResult = React.useCallback(
        (result: IResult<LoginResultData>) => {
            // Hide loading bar
            api.singleton.hideLoading();

            // Error, return anyway
            if (!result.ok) {
                return;
            }

            // Redirect after successfully log in
            let redirectUrl = null;
            const referrer = (location.state as PrivateRouteRedirectState)
                ?.referrer;
            if (referrer && referrer.pathname) {
                redirectUrl = referrer.pathname + referrer.search;
            } else if (location.search) {
                redirectUrl = new URLSearchParams(location.search).get(
                    'redirect'
                );
            }

            // referer should not contain '://' to avoid any open redirect attacks posibility
            if (
                redirectUrl == null ||
                redirectUrl === '/login' ||
                redirectUrl.indexOf('://') > 0
            ) {
                redirectUrl = '/main';
            }

            history.push(redirectUrl);
        },
        [api.singleton, location, history]
    );

    // Login action
    async function doLogin(data: DataTypes.DynamicData) {
        // Attach the limited organization id
        const settings = ApiSettings.get();
        Object.assign(data, {
            org: settings.org
        });

        // Show loading bar
        api.singleton.showLoading();

        // Act
        const result = await api.login(
            dispatch,
            data as LoginModel,
            loginSuccess
        );

        if (result == null) {
            // Error found
            return undefined;
        }

        // Do result
        loginResult(result);

        // Return
        return result;
    }

    // Saved login data
    const saveLoginData = SaveLogin.get();
    let tryingLogin = false;

    // inaccessibleLabel;
    const inaccessibleLabel: string = L.labels.inaccessible;
    const tryAgainLabel: string = L.labels.try_again;

    // Ready
    React.useEffect(() => {
        // Trying login only
        if (!tryingLogin || state.authorized) return;

        // Show loading bar
        api.singleton.showLoading('Loading...');

        // Model
        const loginTokenData: LoginTokenModel = {
            id: saveLoginData!.id,
            token: saveLoginData!.token!
        };

        // Act
        api.loginToken(dispatch, loginTokenData, loginSuccess, (error) => {
            if (error.response == null) {
                // Connection error
                api.singleton.reportError(
                    inaccessibleLabel,
                    () => {
                        // Refresh to login page
                        dispatch({ type: UserActionType.Logout });
                    },
                    tryAgainLabel
                );
                return false;
            }

            // Clear token
            SaveLogin.update(undefined);

            // Refresh to login page
            dispatch({ type: UserActionType.Logout });

            // Prevent further handling
            return false;
        }).then((result) => {
            // Error occured
            if (result == null) return;

            // Do result only successful
            if (result.ok) loginResult(result);
            else {
                // Hide loading bar
                api.singleton.hideLoading();
            }
        });
    }, [
        tryingLogin,
        state.authorized,
        api,
        dispatch,
        loginResult,
        loginSuccess,
        saveLoginData,
        inaccessibleLabel,
        tryAgainLabel
    ]);

    if (state.authorized) {
        // When logined
        // Empty component
        return <></>;
    }

    let savedUserId: string = '';
    if (saveLoginData) {
        // Saved user id, like email address
        savedUserId = saveLoginData.rawId;

        if (saveLoginData.token) {
            // Flag is trying logi
            tryingLogin = true;

            // Empty component
            return <></>;
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.logoContainer}>
                <img
                    src={`${process.env.PUBLIC_URL}/logo.jpg`}
                    alt="Logo"
                    className={classes.logo}
                />
            </div>
            <LanguageChooser
                className={classes.language}
                items={Settings.supportedLanguages}
                title="Languages"
                onClose={closeLanguageChoose}
                selectedValue={Settings.currentLanguage}
            />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <LoginForm callback={doLogin} savedUserId={savedUserId} />
            </div>
            <Box mt={6}>
                <Typography color="textSecondary" align="center">
                    SmartERP for recruiting service
                </Typography>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                >
                    Powered by
                    <Link
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.etsoo.com/"
                    >
                        {L.labels.etsoo}
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}

export default Login;
