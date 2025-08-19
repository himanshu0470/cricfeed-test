// utils/navigation.ts

import { Page } from '@/types/types';
import { MatchData } from '@/types/matches';

interface GetDynamicUrlParams {
    pages: Page[];
    linkURL: string;
    match: MatchData;
}

interface GetTournamentUrlParams {
    pages: Page[];
    linkURL: string;
    tournament: any;
}

export function getFullScorePageUrl({ pages, linkURL, match }: GetDynamicUrlParams): string | null {
    // Find the page where `isLink` is true and `linkURL` matches
    const matchingPage = pages.find(page => page.isLink && page.linkURL === linkURL);

    if (!matchingPage) {
        console.error(`No matching page found for linkURL: ${linkURL}`);
        return null;
    }

    // Extract the alias
    const pageAlias = matchingPage.alias;

    if (!pageAlias) {
        console.error(`Page alias is missing for linkURL: ${linkURL}`);
        return null;
    }

    // Build the dynamic URL
    const date = match.ed.split('/').join('-').toLowerCase();
    const tournament = match.com.toLowerCase().replace(/\s+/g, '-');
    const teams = match.en.toLowerCase().replace(/\s+/g, '-');

    return `/${pageAlias}/${match.cid}/${match.en.replace(/\s+/g, '-')}/${match.com.replace(/\s+/g, '-')}`;
}

export function getTournamentUrl({ pages, linkURL, tournament }: GetTournamentUrlParams): string | null {
    // Find the page where `isLink` is true and `linkURL` matches
    const matchingPage = pages.find(page => page.isLink && page.linkURL === linkURL);
    
    if (!matchingPage) {
        console.error(`No matching page found for linkURL: ${linkURL}`);
        return null;
    }

    // Extract the alias
    const pageAlias = matchingPage.alias;

    if (!pageAlias) {
        console.error(`Page alias is missing for linkURL: ${linkURL}`);
        return null;
    }

    const competition = tournament?.competitionName ? tournament.competitionName.toLowerCase().replace(/\s+/g, '-') : "";

    return `/${pageAlias}/${tournament.competitionId}/${competition}`;
}

export function slugToCompetitionName(slug:string) {
    if (!slug) return "";
    
    // Replace hyphens with spaces, then capitalize each word
    const competitionName = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words with spaces
    
    return competitionName;
}
