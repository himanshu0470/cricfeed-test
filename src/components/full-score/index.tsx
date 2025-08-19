// @ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { api } from "@/lib/apiUtils";
import { useApp } from "@/app/providers";
import { LoadingScreen } from "@/components/animations/LoadingScreen";
import TabNavigation from "@/components/full-score/TabNavigation";
import { Page } from "@/types/types";
import { ModuleData } from "@/types/matches";
import { FULL_SCORE_COMPONENT } from "@/constants/fullScoreConst";
import LiveTab from "@/components/full-score/tabs/Live";
import ScoreCardTab from "@/components/full-score/tabs/Scorecard";
import CommentaryTab from "@/components/full-score/tabs/Commentary";
import PredictTab from "@/components/full-score/tabs/Predict";
import OutcomeTab from "@/components/full-score/tabs/Outcome";
import TeamTab from "@/components/full-score/tabs/Team";
import PartnershipTab from "@/components/full-score/tabs/Partnership";
import { OversTab } from "@/components/full-score/tabs/Overs";
import GraphTab from "@/components/full-score/tabs/Graph";
import { useFullScoreData } from "@/hooks/useFullScoreSocket";
import {
  formatChartData,
  formatCommentaryData,
  formatPartnershipTabData,
  formatTeamData,
  processLiveTabData,
  transformToScoreData,
} from "@/utils/fullscore";
import { isEmpty } from "lodash";
import { CONFIG } from "@/config/config";
import FullScoreContent from "./shared/TeamScore";
// import { RunnerData } from '@/types/full-score/teamScore';

import { useMatchSocket } from "@/hooks/useMatchSocket";
import { getMatchType, teamRunnerSocket } from "@/utils/function";
import PredictMarket from "@/components/full-score/tabs/Predict";
import OutcomeMarket from "@/components/full-score/tabs/Outcome";

type TabId =
  | "live"
  | "scorecard"
  | "commentary"
  | "team"
  | "partnership"
  | "overs"
  | "graph"
  | "predict"
  | "outcome";

const replacePlaceholders = (template: string, data: Record<string, any>) => {
  return template.replace(/#(\w+)#/g, (_, key) => data[key] || "");
};

export default function FullScorePage() {
  const pathname = usePathname();
  const { initialData } = useApp();
  const pages = initialData?.pages || [];
  const commentaryId = pathname?.split("/").filter(Boolean)[1];

  const [pageDetails, setPageDetails] = useState<Page | null>(null);
  const [matchData, setMatchData] = useState<ModuleData[] | null>(null);
  const [commentaryDetails, setCommentaryDetails] = useState<Record<
    string,
    any
  > | null>(null);
  const [commentaryData, setCommentaryData] = useState<Record<
    string,
    any
  > | null>(null);
  const [commentaryTeams, setCommentaryTeams] = useState<Record<
    string,
    any
  > | null>(null);
  const [commentaryPlayers, setCommentaryPlayers] = useState<Record<
    string,
    any
  > | null>(null);
  const [commentaryBallByBall, setCommentaryBallByBall] = useState<Record<
    string,
    any
  > | null>(null);
  const [commentaryWicket, setCommentaryWicket] = useState<Record<
    string,
    any
  > | null>(null);
  const [commentaryOvers, setCommentaryOvers] = useState<Record<
    string,
    any
  > | null>(null);
  const [commentaryPartnership, setCommentaryPartnership] = useState<Record<
    string,
    any
  > | null>(null);
  const [marketOddsBallByBall, setMarketOddsBallByBall] = useState<Record<
    string,
    any
  > | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("live");
  const [userSelectedTab, setUserSelectedTab] = useState<boolean>(false); // Track if user manually selected tab
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState<string>("");
  const [pageHeading, setPageHeading] = useState<string>("");
  const [seoDescription, setSeoDescription] = useState<string>("");
  const [seoKeywords, setSeoKeywords] = useState<string>("");
  const [inProgress, setInProgress] = useState(false);
  const [isShowClient, setIsShowClient] = useState(true);
  const [runnerData, setRunnerData] = useState(null);
  const [showPredictTab, setShowPredictTab] = useState(null);
  const [showOutcomeTab, setShowOutcomeTab] = useState(null);
  // const [imgBaseUrl, setImgBaseUrl] = useState<string>("");
  // console.log({
  //     commentaryDetails,
  //     commentaryTeams,
  //     commentaryPlayers,
  //     commentaryBallByBall,
  //     commentaryWicket,
  //     commentaryOvers,
  //     commentaryPartnership
  // });

  // Add state for sidebar data
  const [sidebarData, setSidebarData] = useState<{
    openMarkets: any[];
    settledMarkets: any[];
    dataProviderUrl: string;
  } | null>(null);
  
  const isFirstLoad = useRef(true);


  // Initialize useFullScoreData hook
  const {
    commentaryDetails: socketCommentaryDetails,
    currentTeamsData,
    currentPlayersData,
    currentBallByBallData,
    currentWicketData,
    currentOversData,
    currentPartnershipData,
    marketOddsBallByBallData,
    loading: socketLoading,
    processTeamsData,
    processOversData,
    matchData: mt,
  } = useFullScoreData({ commentaryId: commentaryId || "" });

  useEffect(() => {
    commentaryDetails ? setIsLoading(false) : setIsLoading(false);
  }, []);

  // const fetchConfigData = async () => {
  //     try {
  //         const response = await api.getConfigData();
  //         const credentials = response?.domain;
  //         if(credentials) {
  //             setImgBaseUrl(
  //                 credentials?.imagePath
  //             );
  //         }
  //     } catch (error) {
  //         console.error("Error fetching config data:", error);
  //     }
  // };

  // useEffect(() => {
  //     fetchConfigData();
  // }, []);

  // Extract pageDetails based on linkURL
  useEffect(() => {
    const matchingPage = pages.find(
      (page) => page.linkURL === FULL_SCORE_COMPONENT
    );
    setPageDetails(matchingPage || null);
  }, [pages]);

  const {
    matchData: overData,
    marketRunnerData,
    matchOversData,
    liveTabData,
  } = useMatchSocket({
    commentaryId: commentaryId,
    // initialData: initialMatchData
  });

  let currOver = overData?.scov;
  let cbb = matchOversData;
  // const currOverdata =  {}
  useEffect(() => {
    const team1runner = teamRunnerSocket(
      marketRunnerData,
      overData?.t1id,
      overData?.t1n
    );
    const team2runner = teamRunnerSocket(
      marketRunnerData,
      overData?.t2id,
      overData?.t2n
    );
    const draw =
      marketRunnerData?.length > 0
        ? marketRunnerData.find((item) => item.runner == "The Draw")
        : null;
    setRunnerData({
      team1Runner: team1runner,
      team2Runner: team2runner,
      drawRunner: draw,
    });
  }, [
    marketRunnerData,
    overData?.t1id,
    overData?.t2id,
    overData?.t1n,
    overData?.t2n,
  ]);

  // Fetch initial match data
  useEffect(() => {
    const fetchMatchData = async () => {
      if (!commentaryId) return;

      try {
        setIsLoading(true);
        const response = await api.getFullScoreCard(commentaryId);
        setMatchData(response || null);

        // Set state for each module separately
        response?.forEach((module: ModuleData) => {
          switch (module.module) {
            case "commentaryDetails":
              setCommentaryDetails(module.data);
              setCommentaryData(module.data);
              break;
            case "commentaryTeams":
              setCommentaryTeams(module.data);
              break;
            case "commentaryPlayers":
              setCommentaryPlayers(module.data);
              break;
            case "commentaryBallByBall":
              setCommentaryBallByBall(module.data);
              break;
            case "commentaryWicket":
              setCommentaryWicket(module.data);
              break;
            case "commentaryOvers":
              setCommentaryOvers(module.data);
              break;
            case "commentaryPartnership":
              setCommentaryPartnership(module.data);
              break;
            case "marketOddsBallByBall":
              setMarketOddsBallByBall(module.data);
              break;
          }
        });
      } catch (error) {
        console.error("Error fetching match data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatchData();
  }, [commentaryId]);

  // Sync socket data with state
  useEffect(() => {
    if (socketCommentaryDetails) {
      setCommentaryDetails(socketCommentaryDetails);
      setCommentaryData(socketCommentaryDetails);
    }
    if (currentTeamsData) setCommentaryTeams(currentTeamsData);
    if (currentPlayersData) setCommentaryPlayers(currentPlayersData);
    if (currentBallByBallData) setCommentaryBallByBall(currentBallByBallData);
    if (currentWicketData) setCommentaryWicket(currentWicketData);
    if (currentOversData) setCommentaryOvers(currentOversData);
    if (currentPartnershipData)
      setCommentaryPartnership(currentPartnershipData);
    if (mt) setMatchData(mt);
    if (marketOddsBallByBallData) {
      setMarketOddsBallByBall((prevMarket) => {
        const newMarketData = marketOddsBallByBallData;
        const updateMarket = prevMarket ? [...prevMarket] : [];
        newMarketData.forEach((newMarket) => {
          const existingIndex = updateMarket.findIndex(
            (item) => item.id === newMarket?.id
          );
          if (existingIndex === -1) {
            updateMarket.push(newMarket);
          }
        });
        return updateMarket;
      });
    }
  }, [
    socketCommentaryDetails,
    currentTeamsData,
    currentPlayersData,
    currentBallByBallData,
    currentWicketData,
    currentOversData,
    currentPartnershipData,
    marketOddsBallByBallData,
  ]);

  // Update page metadata
  useEffect(() => {
    if (isEmpty(pageDetails)) {
      setPageTitle("Full Score");
    } else {
      setPageTitle(
        replacePlaceholders(
          pageDetails?.pageTitle || "",
          commentaryDetails || {}
        )
      );
      setPageHeading(
        replacePlaceholders(
          pageDetails?.pageHeading || "",
          commentaryDetails || {}
        )
      );
      setSeoDescription(
        replacePlaceholders(
          pageDetails?.seoDescription || "",
          commentaryDetails || {}
        )
      );
      setSeoKeywords(
        replacePlaceholders(pageDetails?.seoWord || "", commentaryDetails || {})
      );
    }
  }, [commentaryDetails, pageDetails]);

  // useEffect(() => {
  //   const fetchMarketContent = async (commentaryId: string) => {
  //     if (!commentaryId) return;
  //     try {
  //       const response = await api.getFullScoreSidebarData(commentaryId);

  //       if (response) {
  //         const openMarketData = response?.openMarkets || [];
  //         const settledMarketData = response?.settledMarkets || [];
  //         setShowPredictTab(openMarketData.length > 0);
  //         setShowOutcomeTab(settledMarketData.length > 0);
  //       }
  //     } catch (error) {
  //     } 
  //   };
  //   if (commentaryDetails?.eventRefId) {
  //     console.log("Inside this", commentaryDetails?.eventRefId);
  //     fetchMarketContent(commentaryDetails?.eventRefId);
  //   }
  // }, [commentaryDetails]);

  // OPTIMIZED: Single API call for sidebar data
  useEffect(() => {
    const fetchMarketContent = async (commentaryId: string) => {
      if (!commentaryId) return;
      try {
        const response = await api.getFullScoreSidebarData(commentaryId);

        if (response) {
          const openMarketData = response?.openMarkets || [];
          const settledMarketData = response?.settledMarkets || [];
          
          // Set tab visibility
          setShowPredictTab(openMarketData.length > 0);
          setShowOutcomeTab(settledMarketData.length > 0);
          
          // Store the complete sidebar data to pass to components
          setSidebarData({
            openMarkets: openMarketData,
            settledMarkets: settledMarketData,
            dataProviderUrl: response?.dataProviderUrl || ""
          });
        }
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      } 
    };
    
    if (commentaryDetails?.commentaryId) {
      fetchMarketContent(commentaryDetails?.commentaryId);
    }
  }, [commentaryDetails]);

  // Store user's tab preference per commentaryId
  const handleTabChange = (newTab: TabId) => {
    setActiveTab(newTab);
    setUserSelectedTab(true);
    
    // Store user's tab preference for this commentary
    if (commentaryId) {
      localStorage.setItem(`activeTab_${commentaryId}`, newTab);
    }
  };


  useEffect(() => {
    if (commentaryData && commentaryId && isFirstLoad.current) {
      setIsShowClient(commentaryData?.isClientShow);
      const matchStatus = getMatchType(commentaryData?.commentaryStatus);

      // Check if user has a stored tab preference for this commentary
      const storedTab = localStorage.getItem(`activeTab_${commentaryId}`) as TabId;

      if (storedTab) {
        // Use stored preference if available
        setActiveTab(storedTab);
      } else {
        // Use default logic only if no stored preference
        const defaultTab = matchStatus === "LIVE" && commentaryData?.isClientShow
          ? "live"
          : matchStatus === "LIVE"
          ? "commentary"
          : matchStatus === "UPCOMING"
          ? "team"
          : "scorecard";
        setActiveTab(defaultTab);
      }
      
      isFirstLoad.current = false;
      setInProgress(matchStatus === "LIVE");
    } else if (commentaryData) {
      // Only update non-tab related state on subsequent updates (notifications)
      setIsShowClient(commentaryData?.isClientShow);
      const matchStatus = getMatchType(commentaryData?.commentaryStatus);
      setInProgress(matchStatus === "LIVE");
    }
  }, [commentaryData, commentaryId]); // Removed userSelectedTab from dependencies
  
  useEffect(() => {
    setUserSelectedTab(false);
    isFirstLoad.current = true;
  }, [commentaryId]);

  const renderTabContent = () => {
    if (!matchData) return null;
    const commonProps = {
      isShowClient: commentaryDetails?.isClientShow,
      loading: isLoading,
      // imgBaseUrl,
    };
    switch (activeTab) {
      case "live": {
        const processedData = processLiveTabData(
          commentaryDetails,
          commentaryPlayers,
          commentaryBallByBall,
          commentaryTeams,
          overData,
          liveTabData
        );
        return <LiveTab {...commonProps} {...processedData} />;
      }
      case "scorecard":
        return (
          <ScoreCardTab
            {...commonProps}
            scoreCardData={{
              commentaryDetails,
              commentaryTeams,
              commentaryPlayers,
              commentaryWicket,
            }}
          />
        );
      case "overs":
        return (
          <OversTab
            {...commonProps}
            OversData={{
              overDetails: commentaryOvers,
              ballsData: commentaryBallByBall,
              playerData: commentaryPlayers,
              teamData: commentaryTeams,
              commentaryDetails: commentaryDetails,
            }}
          />
        );
      case "commentary":
        return (
          <CommentaryTab
            {...commonProps}
            commentaryOverData={formatCommentaryData({
              commentaryDetails,
              commentaryTeams,
              commentaryPlayers,
              commentaryBallByBall,
              commentaryOvers,
              marketOddsBallByBall,
            })}
          />
        );
      case "predict":
        return <PredictMarket commentaryId={commentaryDetails?.eventRefId}
            sidebarData={sidebarData} />;// Pass the data as props 
      case "outcome":
        return <OutcomeMarket commentaryId={commentaryDetails?.eventRefId}
            sidebarData={sidebarData} />;// Pass the data as props 
      case "team":
        return (
          <TeamTab
            {...commonProps}
            teamData={formatTeamData(
              commentaryDetails,
              commentaryTeams,
              commentaryPlayers
            )}
          />
        );
      case "partnership":
        return (
          <PartnershipTab
            {...commonProps}
            partnershipData={formatPartnershipTabData(
              commentaryTeams,
              commentaryPartnership
            )}
          />
        );
      case "graph":
        return (
          <GraphTab
            {...commonProps}
            graphData={formatChartData({
              teamsData: currentTeamsData,
              oversData: currentOversData,
              summery: commentaryDetails,
            })}
          />
        );

      default:
        return null;
    }
  };

  if (isLoading || socketLoading) return <LoadingScreen />;

  if (!pageDetails || !commentaryDetails) {
    return (
      <div className="bg-white rounded-lg shadow-md container-fluid mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Page Not Found</h1>
        <p className="mt-4 text-black">
          The requested page could not be found.
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link href={`${CONFIG.FRONTEND_URL}${pathname}`} rel="canonical" />
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="header text-black z-0 mt-56">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 order-2 lg:order-1">
            <FullScoreContent
              scoreData={transformToScoreData({
                commentaryDetails,
                commentaryTeams,
                currOver,
                cbb,
                liveTabData,
              })}
              runnerData={runnerData}
              inProgress={inProgress}
              isChase={false}
              data={socketCommentaryDetails}
            />
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              isShowClient={isShowClient}
              inProgress={inProgress}
              commentaryStatus={+commentaryDetails?.commentaryStatus}
              showHideTabs={{ showPredictTab, showOutcomeTab }}
            />
            <div className="container-fluid mx-auto">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
