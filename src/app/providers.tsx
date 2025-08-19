// providers.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/apiUtils';
import type { InitialDataResponse } from '@/types';
import { LoadingScreen } from '@/components/animations/LoadingScreen';
import { SocketProvider } from '@/lib/socket/SocketProvider';

interface AppContextType {
  initialData: InitialDataResponse | null;
  isLoading: boolean;
  error: string | null;
  imgBaseUrl: string;
  configData: any;
}

const AppContext = createContext<AppContextType>({
  initialData: null,
  isLoading: true,
  error: null,
  imgBaseUrl: "",
  configData: null,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [initialData, setInitialData] = useState<InitialDataResponse | null>(null);
  const [configData, setConfigData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgBaseUrl, setImgBaseUrl] = useState<string>("");
  const [whitelabelId, setWhitelabelId] = useState<string>("");

  useEffect(() => {
    const fetchConfigData = async () => {
      try {
          setIsLoading(true);
          const response = await api.getConfigData();
          setConfigData(response);
          const credentials = response?.domain;
          if(credentials) {
            setWhitelabelId(credentials?.id);
            setImgBaseUrl(
                credentials?.imagePath
            );
          }
      } catch (error) {
          console.error("Error fetching config data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchConfigData();
  }, []);

  useEffect(() => {
    async function fetchInitialData(whitelabelId: string) {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.getInitialData(whitelabelId);

        if (!data) {
          throw new Error('Failed to fetch initial data');
        }

        setInitialData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if(whitelabelId) {
      fetchInitialData(whitelabelId);
    }
  },[whitelabelId])

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <AppContext.Provider value={{ initialData, isLoading, error, imgBaseUrl, configData }}>
        {children}
      </AppContext.Provider>
    </SocketProvider>
  );
}

export const useApp = () => useContext(AppContext);