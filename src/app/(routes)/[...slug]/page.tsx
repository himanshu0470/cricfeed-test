'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useApp } from '@/app/providers';
import { LoadingScreen } from '@/components/animations/LoadingScreen';
import type { Page } from '@/types/types';
import { FULL_SCORE_COMPONENT } from '@/constants/fullScoreConst';
import { CONFIG } from '@/config/config';

export default function DynamicPage() {
  const params = useParams();
  const { initialData } = useApp();
  const pages = initialData?.pages || [];
  const [pageData, setPageData] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  let DynamicComponent = null;

  useEffect(() => {
    if (pages && pages.length > 0 && params.slug) {
      // Convert slug array to string path
      const fullPath = Array.isArray(params.slug)
        ? `/${params.slug.join('/')}`
        : `/${params.slug}`;

      // Extract the first segment of the path (alias) for matching
      const pathSegments = fullPath.split('/').filter(Boolean); // Remove empty segments
      const alias = `/${pathSegments[0]}`; // First segment as alias

      // Find the matching page
      const currentPage = pages.find(page => {
        const pageAlias = page.alias.startsWith('/') ? page.alias : `/${page.alias}`;
        return pageAlias === alias;
      });

      if (currentPage) {
        setPageData(currentPage);
      }
      setIsLoading(false);
    }
  }, [params.slug, pages]);

  useEffect(() => {
    if (pageData && pageData.pageTitle) {
      // Update the document title based on the page title
      document.title = pageData.pageTitle;
    }
  }, [pageData]);

  if (isLoading) return <LoadingScreen />;

  if (!pageData) {
    return (
      <div className="bg-white rounded-lg shadow-md container-fluid mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Page Not Found</h1>
        <p className="mt-4 text-black">The requested page could not be found.</p>
      </div>
    );
  }

  const { pageHeading, seoDescription, seoWord, isLink, linkURL } = pageData;

  if (isLink && linkURL) {
    try {
      // Dynamically import the component based on the linkURL
      DynamicComponent = dynamic(() => import(`@/components/${linkURL}`), {
        loading: () => <LoadingScreen />,
        ssr: false, // Disable SSR if the component is client-side only
      });
    } catch (error) {
      console.error('Error importing component:', error);
    }
  }

  return (
    <>
      {linkURL !== FULL_SCORE_COMPONENT && (
        <metadata>
          <link href={`${CONFIG.FRONTEND_URL}/${pageData.alias}`} rel="canonical" />
          <title>{pageHeading || ''}</title>
          <meta name="description" content={seoDescription || ''} />
          <meta name="keywords" content={seoWord || ''} />
          <meta name="robots" content="index, follow" />
        </metadata>
      )}
      {/* Render Page Content */}
      {!isLink && (
        <div className={`bg-white shadow-md rounded-lg bg-white ${pageData.linkURL === "Blank page" ? "mt-20":"mt-56" }  mx-auto px-4 py-8`}>
          <h1 className="text-3xl font-bold text-[#062886] page-title">{pageData.pageHeading}</h1>

          {pageData.pageContent && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.pageContent }}
            />
          )}

          {pageData.dynamicParameters && (
            <div
              className="mt-8"
              dangerouslySetInnerHTML={{ __html: pageData.dynamicParameters }}
            />
          )}
        </div>
      )}

      {/* Render Dynamic Component */}
      {linkURL && DynamicComponent && <DynamicComponent />}
    </>
  );

}