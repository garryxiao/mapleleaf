import {
    AppRole,
    IApiConfigurableHost,
    IApiSettings,
    ApiSettings,
    LoginMethod,
    ApiSingleton,
    createClient,
    ApiDataError
} from 'etsoo-react';
import { DomUtils } from '@etsoo/shared';

// eslint-disable-next-line import/extensions
import enLabels from '../i18n/en-US.json';

/**
 * App settings interface for extending
 */
export interface IAppSettings extends IApiSettings {}

// Supported language
const supportedLanguages = [
    { name: 'en-US', label: 'English', labels: enLabels }
];

// Detected language
const { detectedLanguage } = DomUtils;

/**
 * App settings
 */
export const Settings: IAppSettings = {
    // Current language item, like en-US
    currentLanguage: DomUtils.getLanguage(supportedLanguages, detectedLanguage)
        ?.name,

    // Detected language
    detectedLanguage,

    // Login method
    method: LoginMethod.Web,

    // Application role
    role: AppRole.User,

    // Supported languages
    supportedLanguages,

    // Merge public configs
    ...((window as unknown) as IApiConfigurableHost).configs
};

// Rest client
const api = createClient();

// Base url of the API
api.baseUrl = Settings.endpoint;

// Singleton
const singleton = ApiSingleton.getInstance(api);

// Global API error handler
api.onError = (error: ApiDataError<any>) => {
    // Error code
    const status = error.response
        ? api.transformResponse(error.response).status
        : undefined;

    // Report the error
    // When status is equal to 401, redirect to login page
    singleton.reportError(error.toString(), () => {
        if (status === 401) {
            // Redirect to login page
            window.location.href = '/login';
        }
    });
};

/**
 * Update core api settings
 */
export const {
    context: LanguageStateContext,
    provider: LanguageStateProvider
} = ApiSettings.setup(Settings, singleton);
