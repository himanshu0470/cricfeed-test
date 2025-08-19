// types/index.ts

import { ApiResponse } from './api';
import { CompletedMatchesResponse, MatchResponse } from './matches';
import { InitialDataResponse } from './responses';

// Re-export all types from their respective files
export type { ApiResponse } from './api';
export type { MenuBlock, MenuItem, MenuPath, BreadcrumbItem, MenuContext, MenuItemProps, FlattenedMenu } from './menu';
export type { Page } from './page';
export type { NewsItem } from './news';
export type { Banner } from './banner';
export type { Competition } from './competition';
export type { SigninClientPayload } from './signinClient';
export type { ConfigData } from './configData';
export type { InitialDataResponse } from './responses';
export type { MatchData, MatchResponse, CompletedMatchesResponse } from './matches';

// Export combined types
export type ApiInitialDataResponse = ApiResponse<InitialDataResponse>;

// You can add more combined types here as needed
export type ApiMatchResponse = ApiResponse<MatchResponse>;
export type ApiCompletedMatchesResponse = ApiResponse<CompletedMatchesResponse>;