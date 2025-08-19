// Interfaces for Validation and Payloads
interface ValidationValues {
    mobileno?: string;
    countryCode?: string;
    password: string;
    confirmPassword: string;
}

export interface ValidationErrors {
    mobileno?: string;
    password?: string;
    countryCode?: string;
    confirmPassword?: string;
    captchaValue?: string;
    privacyPolicy?: string;
}

export interface ValidationState {
    values: ValidationValues;
    errors: ValidationErrors;
    touched: Record<string, boolean>;
}

export interface CountryCode {
    id: number;
    countryCode: string;
    countryName: string;
    maxNumber: number;
    flag: string;
}

export interface SocialMedia {
    id: number;
    name: string;
    link: string;
    image: string;
    imagePath?: string;
    isActive: boolean;
}

export interface ConfigData {
    key: string;
    value: string;
}

export interface GoogleResponse {
    profileObj: {
        name: string;
        email: string;
        googleId: string;
    };
    tokenId: string;
}

export interface FacebookResponse {
    name: string;
    email: string;
    accessToken: string;
    userID: string;
}
