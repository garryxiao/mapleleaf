import { AppRole, IApiSettings, ApiSettings, LoginMethod, Utils } from 'etsoo-react'

/**
 * App settings interface for extending
 */
export interface IAppSettings extends IApiSettings {
}

// Supported language
const supportedLanguages = [
    { name: 'en-US', label: 'English', labels: require('./../i18n/en-US.json') }
]

// Detected language
const detectedLanguage = Utils.detectedLanguage

/**
 * App settings
 */
export const Settings: IAppSettings = Object.assign({
    // Current language item
    currentLanguage: Utils.getCurrentLanguage(supportedLanguages, detectedLanguage),

    // Detected language
    detectedLanguage,

    // Login method
    method: LoginMethod.Web,

    // Application role
    role: AppRole.User,

    // Supported languages
    supportedLanguages
}, (window as any).Configs)

/**
 * Update core api settings
 */
export const { context: LanguageStateContext, provider: LanguageStateProvider } = ApiSettings.setup(Settings)