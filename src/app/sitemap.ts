// app/sitemap.ts
import { MetadataRoute } from 'next';
import { api } from '@/lib/apiUtils';
import { CONFIG } from '@/config/config';
import type { MatchResponse, MatchData, Page } from '@/types';
import { useApp } from './providers';
import { FULL_SCORE_COMPONENT } from '@/constants/fullScoreConst';

export const revalidate = 3600;

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

// Dynamic URL formatting using alias or linkURL
function formatDynamicMatchUrl(match: MatchData, alias: string): string {
  return `${CONFIG.FRONTEND_URL}${alias}/${match.cid}/${match.en.replace(/\s+/g, '-')}/${match.com.replace(/\s+/g, '-')}`;
}

function getDynamicAlias(pages: Page[], linkURL: string): string {
  const page = pages.find(p => p.linkURL === linkURL);
  return page?.alias ? `/${page.alias}` : '/full-score'; // Default fallback
}

function getChangeFrequency(match: MatchData): ChangeFreq {
  switch (match.cst) {
    case 3: return 'always';  // Live match
    case 1: return 'hourly';  // Upcoming match
    default: return 'daily';  // Completed match
  }
}

function getPriority(match: MatchData): number {
  switch (match.cst) {
    case 3: return 1;    // Live match
    case 1: return 0.9;  // Upcoming match
    default: return 0.7; // Completed match
  }
}

async function getAllCompletedMatches(whitelabelId: string): Promise<MatchData[]> {
  try {
    const firstPage = await api.getCompletedMatches(1, whitelabelId);
    if (!firstPage?.total) return [];

    const totalPages = Math.ceil(firstPage.total / 20);
    const pagePromises = Array.from({ length: totalPages - 1 }, (_, i) =>
      api.getCompletedMatches(i + 2, whitelabelId)
    );

    const allPages = await Promise.all(pagePromises);
    return [
      ...firstPage.data,
      ...allPages.flatMap(page => page?.data || [])
    ];
  } catch (error) {
    console.error('Error fetching completed matches:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const configData = await api.getConfigData();
    const whitelabelId = configData?.domain?.id;

    const [initialData, matchData, completedMatches] = await Promise.all([
      api.getInitialData(whitelabelId),
      api.getMatchData(whitelabelId),
      getAllCompletedMatches(whitelabelId)
    ]);

    const currentDate = new Date().toISOString();
    const routes: MetadataRoute.Sitemap = [];

    // Base routes
    const baseRoutes: MetadataRoute.Sitemap = [
      {
        url: CONFIG.FRONTEND_URL,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 1,
      },
    ];
    routes.push(...baseRoutes);

    // Add dynamic matches using alias
    const fullScoreAlias = getDynamicAlias(initialData?.pages || [], FULL_SCORE_COMPONENT);

    if (matchData?.liveMatches?.length) {
      const liveMatchRoutes: MetadataRoute.Sitemap = matchData.liveMatches.map(match => ({
        url: formatDynamicMatchUrl(match, fullScoreAlias),
        lastModified: currentDate,
        changeFrequency: getChangeFrequency(match),
        priority: getPriority(match),
      }));
      routes.push(...liveMatchRoutes);
    }

    if (matchData?.scheduleMatches?.length) {
      const scheduledMatchRoutes: MetadataRoute.Sitemap = matchData.scheduleMatches.map(match => ({
        url: formatDynamicMatchUrl(match, fullScoreAlias),
        lastModified: currentDate,
        changeFrequency: getChangeFrequency(match),
        priority: getPriority(match),
      }));
      routes.push(...scheduledMatchRoutes);
    }

    if (completedMatches?.length) {
      const completedMatchRoutes: MetadataRoute.Sitemap = completedMatches.map(match => ({
        url: formatDynamicMatchUrl(match, fullScoreAlias),
        lastModified: currentDate,
        changeFrequency: getChangeFrequency(match),
        priority: getPriority(match),
      }));
      routes.push(...completedMatchRoutes);
    }

    // Add news
    if (initialData?.news) {
      const newsRoutes: MetadataRoute.Sitemap = initialData.news
        .filter(news => news.isActive)
        .map(news => ({
          url: `${CONFIG.FRONTEND_URL}/news/${news.newsId}`,
          lastModified: new Date(news.startDate).toISOString(),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        }));
      routes.push(...newsRoutes);
    }

    // Remove duplicates and validate URLs
    const uniqueRoutes = Array.from(
      new Map(routes.map(route => [route.url, route])).values()
    )
      .filter(route => {
        try {
          new URL(route.url);
          return true;
        } catch {
          return false;
        }
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return uniqueRoutes;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [{
      url: CONFIG.FRONTEND_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    }];
  }
}
