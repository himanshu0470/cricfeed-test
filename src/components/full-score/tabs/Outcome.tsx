"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "@/lib/apiUtils";
import PredictOutcomeSkeleton from "@/components/skeleton/PredictOutcomeSkeleton";
import AppImage from "@/constants/AppImage";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useApp } from "@/app/providers";

// Define types for the market data structures
interface Market {
  maxOdds: number;
  minOdds: number;
  marketId: number;
  marketName: string;
  openOdds: number;
  layPrice: number;
  laySize: number;
  backPrice: number;
  backSize: number;
  status: number;
  marketTypeCategoryId: number;
  runner: Array<{
    layPrice: string;
    laySize: string;
    backPrice: string;
    backSize: string;
  }>;
  teamId: number;
  inningsId: number;
  // commentaryId: string;
  commentaryId: string;
  teamImage: string;
  nteamImage: string;
  teamName: string;
  teamShortName: string;
  result: number;
}

interface MarketTypeCategory {
  id: number;
  marketTypeCategori: string;
  displayOrder: number;
}

interface MarketType {
  id: number;
  marketTypeCategories: MarketTypeCategory[];
  displayOrder: number;
  marketType: string;
}

interface SidebarData {
  openMarkets: Market[];
  settledMarkets: Market[];
  dataProviderUrl: string;
}

interface OutcomeMarketProps {
  commentaryId: string;
  sidebarData: SidebarData | null;
}

const OutcomeMarket = ({ commentaryId, sidebarData }: OutcomeMarketProps) => {
  //console.log(commentaryId);
  const [token, setToken] = useState<string>("");
  const [settledMarket, setSettledMarket] = useState<Record<string, Market[]>>(
    {}
  );
  const [openMarket, setOpenMarket] = useState<Market[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataProviderUrl, setDataProviderUrl] = useState<string>("");
  const [marketIds, setMarketIds] = useState<number[]>([]);
  const [ldoMarket, setLdoMarket] = useState<number[]>([]);
  const [expandedPanel, setExpandedPanel] = useState<string | false>(false);
  const [marketTypeCategory, setMarketTypeCategory] = useState<MarketType[]>(
    []
  );
  const socket = useRef<Socket | null>(null);
  const { configData } = useApp();

  useEffect(() => {
    const tokenVal = localStorage.getItem("accessToken");
    setToken(tokenVal || "");
  }, []);

  const handleChange =
    (panelKey: string) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanel(isExpanded ? panelKey : false);
    };

  const groupSettledMarketsByTeamAndInnings = (markets: Market[]) => {
    const groupedMarkets: Record<string, Market[]> = {};
    markets.forEach((market) => {
      const key = `${market.teamId}-${market.inningsId}`;
      if (!groupedMarkets[key]) {
        groupedMarkets[key] = [];
      }
      groupedMarkets[key].push(market);
    });
    return groupedMarkets;
  };

    useEffect(() => {
      if(configData) {
          const marketTypeData = configData?.MarketTypeAndCategory || [];
          const credentials = configData?.configData;
          const ldoMarkets =
            credentials?.find((c: any) => c.key === "LDOMARKET")?.value || "";
          const excludedMarketIds = ldoMarkets
            .split(",")
            .map((id: any) => parseInt(id, 10));
          setLdoMarket(excludedMarketIds);
          setMarketTypeCategory(marketTypeData as MarketType[]);
      }
    },[configData])

  // const fetchLoginCred = async () => {
  //   try {
  //     const response = await api.getConfigData();
  //     const marketTypeData = response?.MarketTypeAndCategory || [];
  //     const credentials = response?.configData;
  //     const ldoMarkets =
  //       credentials?.find((c: any) => c.key === "LDOMARKET")?.value || "";
  //     const excludedMarketIds = ldoMarkets
  //       .split(",")
  //       .map((id) => parseInt(id, 10));
  //     setLdoMarket(excludedMarketIds);
  //     setMarketTypeCategory(marketTypeData as MarketType[]);
  //   } catch (error) {
  //     console.error("Error fetching config data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchLoginCred();
  // }, []);

  // OPTIMIZED: Use data from props instead of making API call
  useEffect(() => {
    if (sidebarData) {
      const settledMarketData = sidebarData.settledMarkets || [];
      const groupedSettledMarketsData = groupSettledMarketsByTeamAndInnings(settledMarketData);
      setSettledMarket(groupedSettledMarketsData);
      setLoading(false);
    }
  }, [sidebarData]);

  const configSocket = (commentaryId: string) => {
    socket.current?.emit("connectEvent", {
      commentaryId: [commentaryId],
    });
    socket.current?.on("updateEvent", (data) => {
      const markets = data?.data?.markets || [];
      setOpenMarket((prevOpenMarket) => {
        const updatedOpenMarket = [...prevOpenMarket];
        markets?.forEach((marketData: any) => {
          const marketIndex = updatedOpenMarket.findIndex(
            (item) => item.marketId == marketData?.marketId
          );
          if (marketIndex !== -1) {
            if (
              marketData?.status == 4 ||
              marketData?.status == 5 ||
              marketData?.status == 6
            ) {
              updatedOpenMarket.splice(marketIndex, 1);
            } else {
              const marketToUpdate = updatedOpenMarket[marketIndex];
              if (marketData?.runner) {
                marketToUpdate.layPrice =
                  marketData?.runner[0]?.layPrice || "0";
                marketToUpdate.laySize = marketData?.runner[0]?.laySize || "0";
                marketToUpdate.backPrice =
                  marketData?.runner[0]?.backPrice || "0";
                marketToUpdate.backSize =
                  marketData?.runner[0]?.backSize || "0";
                marketToUpdate.status = marketData?.status;
              }
            }
          } else {
            if (
              marketData?.runner &&
              marketData?.status != 4 &&
              marketData?.status != 5 &&
              marketData?.status != 6
            ) {
              const newMarket = {
                marketId: marketData?.marketId,
                marketName: marketData?.marketName,
                openOdds: marketData?.openOdds || 0,
                layPrice: marketData?.runner[0]?.layPrice,
                laySize: marketData?.runner[0]?.laySize,
                backPrice: marketData?.runner[0]?.backPrice,
                backSize: marketData?.runner[0]?.backSize,
                status: marketData?.status,
                marketTypeCategoryId: marketData?.marketTypeCategory,
              };
              updatedOpenMarket.push(newMarket as Market);
            }
          }
        });
        return updatedOpenMarket;
      });
    });
  };

  useEffect(() => {
    if (sidebarData?.dataProviderUrl) {
      socket.current = io(sidebarData.dataProviderUrl, {
        transports: ["websocket"],
      });

      if (commentaryId) {
        if (socket.current?.connected) {
          configSocket(commentaryId);
        } else {
          socket.current.on("connect", () => {
            configSocket(commentaryId);
          });
        }
      }
    }
  }, [sidebarData?.dataProviderUrl, commentaryId]);

  const renderOutcomeTab = (): any => {
    if (loading) {
      return <PredictOutcomeSkeleton login={false} />;
    }

    return (
      <div className="outcome-container">
        {Object.keys(settledMarket).map((key) => {
          // key = `${teamId}-${inningsId}`, teamId could be null or number
          const [teamIdRaw, inningsIdRaw] = key.split("-");
          const teamId = teamIdRaw || "unknown";
          const inningsId = inningsIdRaw || "0";

          return (
            <Accordion
              key={key}
              expanded={expandedPanel === key}
              defaultExpanded={+expandedPanel > 0 ? false : true}
              onChange={handleChange(key)}
              className="mt-5 mb-5"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id={`${key}-header`}
                className="batsmen-header h-0"
              >
                {
                  <h5 className="relative w-10 h-10 flex items-center">
                    {![8, 9].includes(
                      settledMarket[key][0]?.marketTypeCategoryId || 0
                    ) && (
                      <AppImage
                        src={
                          settledMarket[key][0]?.nteamImage ||
                          "/assets/images/flag.png"
                        }
                        width={40}
                        height={40}
                        alt="Team Image"
                      />
                    )}
                    <span className="text-white text-sm font-bold pl-2 whitespace-nowrap">
                      {settledMarket[key][0]?.teamName || "Event Market"}
                      {+inningsId !== 1 &&
                        +inningsId !== 0 &&
                        `, Innings ${inningsId}`}
                    </span>
                  </h5>
                }
              </AccordionSummary>
              <AccordionDetails>
                {marketTypeCategory?.length > 0 &&
                  marketTypeCategory
                    ?.sort((a, b) => a.displayOrder - b.displayOrder)
                    ?.map((marketType) => {
                      const hasRelevantMarkets =
                        marketType?.marketTypeCategories.some((subCategory) =>
                          settledMarket[key]?.some(
                            (item) =>
                              item.marketTypeCategoryId === subCategory.id
                          )
                        );
                      if (!hasRelevantMarkets) return null;
                      return (
                        <div
                          key={marketType?.id}
                          className="table-responsive table-scrollbar"
                        >
                          {marketType?.marketTypeCategories?.length > 0 &&
                            marketType?.marketTypeCategories
                              ?.sort((a, b) => a.displayOrder - b.displayOrder)
                              ?.map((subCategory) => {
                                const relevantMarkets = settledMarket[
                                  key
                                ]?.filter(
                                  (item) =>
                                    item.marketTypeCategoryId === subCategory.id
                                );
                                if (relevantMarkets?.length === 0) return null;
                                // Remove Bookmaker Market box from the box
                                if (subCategory.id === 8) return null;

                                return (
                                  <div
                                    key={subCategory?.id}
                                    className="predict-category"
                                  >
                                    <table className="widget-table table settled-table market-table table-striped no-border text-black w-full">
                                      <thead className="sub-category">
                                        <tr>
                                          <th scope="col">
                                            {subCategory.id === 9
                                              ? "Predict Market"
                                              : subCategory.marketTypeCategori}
                                          </th>
                                          <th scope="col">Open</th>
                                          <th scope="col">Min</th>
                                          <th scope="col">Max</th>
                                          <th scope="col">Result</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {relevantMarkets
                                          ?.sort(
                                            (a, b) => a.marketId - b.marketId
                                          )
                                          ?.map((data, index) => (
                                            <tr key={index}>
                                              <td>
                                                {data.marketName
                                                  .toUpperCase()
                                                  .replace("RUNS", "")}
                                              </td>
                                              <td>
                                                {data?.openOdds
                                                  ? Math.round(+data.openOdds)
                                                  : "0"}
                                              </td>
                                              <td>
                                                {data?.minOdds
                                                  ? Math.round(+data.minOdds)
                                                  : "0"}
                                              </td>
                                              <td>
                                                {data?.maxOdds
                                                  ? Math.round(+data.maxOdds)
                                                  : "0"}
                                              </td>
                                              <td>
                                                <div className="flex justify-between items-center mx-2">
                                                  <span
                                                    style={{
                                                      fontSize: "medium",
                                                      color:
                                                        +data.openOdds <
                                                        +data.result
                                                          ? "green"
                                                          : "red",
                                                    }}
                                                  >
                                                    {+data.openOdds <
                                                    +data.result
                                                      ? "<"
                                                      : ">"}
                                                  </span>
                                                  <strong
                                                    style={{
                                                      color:
                                                        +data.openOdds <
                                                        +data.result
                                                          ? "green"
                                                          : "red",
                                                    }}
                                                  >
                                                    {data?.result
                                                      ? data.result
                                                      : "0"}
                                                  </strong>
                                                </div>
                                              </td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                );
                              })}
                        </div>
                      );
                    })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    );
  };
  return renderOutcomeTab();
};
export default OutcomeMarket;
