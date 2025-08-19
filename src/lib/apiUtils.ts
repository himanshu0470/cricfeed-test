// lib/apiUtils.ts
import { CONFIG } from '@/config/config';
import type { ApiResponse, InitialDataResponse } from '@/types';
import { ConfigData } from '@/types/configData';
import { LiveScheduleMatchesResponse, CompletedMatchesResponse, MatchData, MatchResponse, ModuleData } from '@/types/matches';
import { CountryCode, SocialMedia } from '@/types/register';

interface ApiOptions {
    endpoint: string;
    body?: Record<string, any>;
}
const BASE_URL = CONFIG.FRONTEND_URL || 'http://localhost:3000'; // Default for development
async function apiCall<T>(options: ApiOptions): Promise<T | null> {
    const { endpoint, body = {} } = options;
    try {
        const url = `${BASE_URL}${endpoint}`;
        // Always use the Next.js API routes
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Details:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse<T> = await response.json();

        if (!data.success) {
            throw new Error(data.message || 'API request failed');
        }

        return data.result;
    } catch (error: any) {
        console.error(`Error in API call to ${endpoint}:`, error);
        return error;
    }
}

export const api = {
    getInitialData: async (whitelabelId: string) =>
        apiCall<InitialDataResponse>({
            endpoint: '/api/menu/init',
            body: {whitelabelId}
        }),
    newsViewers: async (item: any) =>{
        try {
            const data = await apiCall({
                endpoint: '/admin/newsViewers/save',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in newsViewers:', error);
            return null;
        }
    },
    bannerViewers: async (item: any) =>{
        try {
            const data = await apiCall({
                endpoint: '/admin/bannerViewers/save',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in bannerViewers:', error);
            return null;
        }
    },
    getMatchData: async (whitelabelId: string) => {
        try {
            const data = await apiCall<MatchResponse>({
                endpoint: '/api/matches/scheduled-match',
                body: {whitelabelId}
            });
            return data || { liveMatches: [], scheduleMatches: [] };
        } catch (error) {
            console.error('Error in getMatchData:', error);
            return { liveMatches: [], scheduleMatches: [] };
        }
    },

    getLiveScheduleMatches: async (page = 1, competitionId = 0, whitelabelId: string) => {
        try {
            const data = await apiCall<LiveScheduleMatchesResponse>({
                endpoint: '/api/matches/scheduled-live-match',
                body: { page, limit: 20, competitionId, whitelabelId }
            });
            return data || { data: [], totalItems: 0, currentPage: 1, totalPages: 1 };
        } catch (error) {
            console.error('Error in getLiveScheduleMatches:', error);
            return { data: [], totalItems: 0, currentPage: 1, totalPages: 1 };
        }
    },

    getCompletedMatches: async (page = 1, whitelabelId: string) => {
        try {
            const data = await apiCall<CompletedMatchesResponse>({
                endpoint: '/api/matches/completed-matches',
                body: { page, limit: 20, whitelabelId }
            });
            return data || { data: [], totalItems: 0, currentPage: 1, totalPages: 1, total: 0 };
        } catch (error) {
            console.error('Error in getCompletedMatches:', error);
            return { data: [], totalItems: 0, currentPage: 1, totalPages: 1, total: 0 };
        }
    },

    getPhotoLibrary: async (page = 1) => {
        try {
            const data = await apiCall<any>({
                endpoint: '/api/matches/get-photo-library',
                body: { page, limit: 5 }
            });
            return data || { data: [], totalItems: 0, currentPage: 1, totalPages: 1 };
        } catch (error) {
            console.error('Error in getPhotoLibrary:', error);
            return { data: [], totalItems: 0, currentPage: 1, totalPages: 1 };
        }
    },

    getVideoLibrary: async (page = 1) => {
        try {
            const data = await apiCall<any>({
                endpoint: '/api/matches/get-video-library',
                body: { page, limit: 5 }
            });
            return data || { data: [], totalItems: 0, currentPage: 1, totalPages: 1 };
        } catch (error) {
            console.error('Error in getVideoLibrary:', error);
            return { data: [], totalItems: 0, currentPage: 1, totalPages: 1 };
        }
    },

    getFullScoreCard: async (commentaryId: string) => {
        try {
            const data = await apiCall<{ commentaryId: string; value: ModuleData[]; }>
                ({ endpoint: '/api/matches/get-full-scorecard', body: {commentaryId :  Number(commentaryId) } });
            if (!data?.value) {
                console.error('Invalid API response structure:', data);
                return null;
            }
            // Return the ModuleData array directly
            return data.value;
        } catch (error) {
            console.error('Error in getFullScoreCard:', error);
            return null;
        }
    },

    getFullScoreSidebarData: async (commentaryId: string) => {
        try {
            const data = await apiCall<{ dataProviderUrl: string; openMarkets: any[]; settledMarkets: any[]}>
                ({ endpoint: '/api/matches/get-fullscore-sidebar', body: { commentaryId } });
            if (!data) {
                console.error('Invalid API response structure:', data);
                return null;
            }
            // Return the ModuleData array directly
            return data;
        } catch (error) {
            console.error('Error in getFullScoreCard:', error);
            return null;
        }
    },

    getCommentary: async (eid: string) => {
        try {
            const data = await apiCall<ApiResponse>({
                endpoint: '/api/matches/commentary',
                body: { eid }
            });
            return data;
        } catch (error) {
            console.error('Error in getCommentary:', error);
            return null;
        }
    },
    getConfigData: async () => {
        try {
            const data = await apiCall<ConfigData>({
                endpoint: '/api/matches/config-data'
            });
            return data;
        } catch (error) {
            console.error('Error in getConfigData:', error);
            return null;
        }
    },
    countryCodes: async () => {
        try {
            const data = await apiCall<CountryCode[]>({
                endpoint: '/api/matches/country-codes'
            });
            return data;
        } catch (error) {
            console.error('Error in countryCodes:', error);
            return null;
        }
    },
    socialMedia: async () => {
        try {
            const data = await apiCall<SocialMedia[]>({
                endpoint: '/api/matches/social-media'
            });
            return data;
        } catch (error) {
            console.error('Error in socialMedia:', error);
            return null;
        }
    },
    signinClient: async (item: any) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/signin-client',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in signinClient:', error);
            return null;
        }
    },
    signupClient: async (item: any) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/signup-client',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in signupClient:', error);
            return null;
        }
    },
    getDetailsByEmailId: async (clientId: string) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/user-profile',
                body: {clientId}
            });
            return data;
        } catch (error) {
            console.error('Error in getDetailsByEmailId:', error);
            return null;
        }
    },
    updateProfile: async (editedData: any) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/update-profile',
                body: editedData
            });
            return data;
        } catch (error) {
            console.error('Error in updateProfile:', error);
            return null;
        }
    },
    verifyOTP: async (item: any) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/verify-otp',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in verifyOTP:', error);
            return null;
        }
    },
    otplessVerify: async (item: any) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/otpless-verify',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in otplessVerify:', error);
            return null;
        }
    },
    saveDevice: async (item: any) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/save-device',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in saveDevice:', error);
            return null;
        }
    },
    forgotPassword: async (item: any) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/forgot-password',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in forgotPassword:', error);
            return null;
        }
    },
    resetPassword: async (item: any) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/reset-password',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in resetPassword:', error);
            return null;
        }
    },
    forgotOTPVerify: async (item: any) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/forgot-otp-verify',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in forgotOTPVerify:', error);
            return null;
        }
    },
    resendOTP: async (item: any) => {
        try {
            const data = await apiCall({
                endpoint: '/api/matches/resend-otp',
                body: item
            });
            return data;
        } catch (error) {
            console.error('Error in resendOTP:', error);
            return null;
        }
    },
};