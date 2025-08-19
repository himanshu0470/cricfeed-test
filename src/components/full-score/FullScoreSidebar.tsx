"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "@/lib/apiUtils";
import FullScoreSidebarContentSkeleton from "../skeleton/FullScoreSidebarContentSkeleton";
import AppImage from "@/constants/AppImage";
import { useApp } from "@/app/providers";
// import { usePathname } from "next/navigation";

// import FullScoreSidebarContentSkeleton from "./Skeleton/FullScoreSidebarContentSkeleton";

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

interface ParamsData {
  id: string;
}

const FullScoreSidebar = ({ commentaryId }: any) => {
  const [token, setToken] = useState<string>("");
  const [openMarket, setOpenMarket] = useState<Market[]>([]);
  const [settledMarket, setSettledMarket] = useState<Record<string, Market[]>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [dataProviderUrl, setDataProviderUrl] = useState<string>("");
  const [marketIds, setMarketIds] = useState<number[]>([]);
  const [ldoMarket, setLdoMarket] = useState<number[]>([]);
  const [marketTypeCategory, setMarketTypeCategory] = useState<MarketType[]>(
    []
  );
  const socket = useRef<Socket | null>(null);
  const { configData } = useApp();

  useEffect(() => {
    const tokenVal = localStorage.getItem("accessToken");
    setToken(tokenVal || "");
  }, []);

  const groupMarketsByTeamAndInnings = (markets: Market[]) => {
    const groupedMarkets: Record<string, Market[]> = {};
    markets.forEach((market) => {
      const key = `${market.teamId}-${market.inningsId}`;
      if (!groupedMarkets[key]) {
        groupedMarkets[key] = [];
      }
      groupedMarkets[key].push(market);
      setMarketIds((prevIds) => [...prevIds, market.marketId]);
    });
    return groupedMarkets;
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

  useEffect(() => {
    const fetchMarketContent = async (commentaryId: string) => {
      if (!commentaryId) return;
      try {
        setLoading(true);
        const response = await api.getFullScoreSidebarData(commentaryId);

        if (response) {
          const openMarketData = response?.openMarkets || [];
          const settledMarketData = response?.settledMarkets || [];
          const groupedOpenMarketsData =
            groupMarketsByTeamAndInnings(openMarketData);
          const groupedSettledMarketsData =
            groupSettledMarketsByTeamAndInnings(settledMarketData);
          setOpenMarket(openMarketData || []);
          setSettledMarket(groupedSettledMarketsData);
          setDataProviderUrl(response?.dataProviderUrl);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    if (commentaryId) {
      fetchMarketContent(commentaryId);
    }
  }, [commentaryId]);

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
    if (dataProviderUrl) {
      socket.current = io(dataProviderUrl, {
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
  }, [dataProviderUrl, commentaryId]);

  return token ? (
    loading ? (
      <FullScoreSidebarContentSkeleton login={false} />
    ) : (
      <>
        <div className="mb-5">
          {marketTypeCategory?.length > 0 &&
            marketTypeCategory
              ?.sort((a, b) => a.displayOrder - b.displayOrder)
              ?.map((marketType) => {
                const hasRelevantMarkets =
                  marketType?.marketTypeCategories.some((subCategory) =>
                    openMarket?.some(
                      (item) =>
                        item.marketTypeCategoryId === subCategory.id &&
                        item.status !== 4
                    )
                  );
                if (!hasRelevantMarkets) return null;
                return (
                  <div
                    key={marketType?.id}
                    className="card bg-white shadow-lg p-0 table-responsive table-scrollbar my-2"
                  >
                    {marketType?.marketTypeCategories?.length > 0 &&
                      marketType?.marketTypeCategories
                        ?.sort((a, b) => a.displayOrder - b.displayOrder)
                        ?.map((subCategory) => {
                          const relevantMarkets = openMarket.filter(
                            (item) =>
                              item.marketTypeCategoryId === subCategory.id &&
                              item.status !== 4 &&
                              !ldoMarket.includes(item.marketTypeCategoryId)
                          );
                          if (relevantMarkets.length === 0) return null;
                          return (
                            <div
                              key={subCategory?.id}
                              className="sidebar-category"
                            >
                              <table className="widget-table table market-table table-striped no-border text-black">
                                <thead className="sub-category">
                                  <tr>
                                    <th scope="col">
                                      {/* {subCategory?.marketTypeCategori} */}
                                      {subCategory.id ===9 ? "Predict Market": subCategory.marketTypeCategori}
                                    </th>
                                    <th scope="col">Open</th>
                                    <th scope="col"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {relevantMarkets
                                    ?.filter((item) => item.status !== 4)
                                    ?.sort((a, b) => a?.marketId - b?.marketId)
                                    ?.map((data, index) => (
                                      <tr key={index}>
                                        <td>
                                          {data.marketName
                                            .toUpperCase()
                                            .replace("RUNS", "")}
                                        </td>
                                        <td>
                                          {data?.status == 1 ? (
                                            <>
                                              {data?.openOdds
                                                ? data.openOdds
                                                : null}
                                            </>
                                          ) : null}
                                        </td>
                                        <td className="pr-0">
                                          {data?.status == 1 ? (
                                            <div className="flex items-center justify-center">
                                              <div className="no-rate">
                                                <div className="rate-font">
                                                  {data.layPrice || "0"}
                                                </div>
                                                <div className="point-font">
                                                  {data.laySize || "0"}
                                                </div>
                                              </div>
                                              <div className="yes-rate">
                                                <div className="rate-font">
                                                  {data.backPrice || "0"}
                                                </div>
                                                <div className="point-font">
                                                  {data.backSize || "0"}
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="flex items-center justify-center market-suspended-container">
                                              <div className="no-rate-suspend"></div>
                                              <div className="yes-rate-suspend"></div>
                                              <div className="overlay">
                                                <span className="suspended-text">
                                                  Market suspend
                                                </span>
                                              </div>
                                            </div>
                                          )}
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
        </div>
        {Object.keys(settledMarket).map((key) => {
          const [teamId, inningsId] = key.split("-");
          return (
            <div key={key}>
              <div className="card bg-white shadow-lg p-0 rounded-lg my-2">
                {![8, 9].includes(
                  settledMarket[key][0]?.marketTypeCategoryId || 0
                ) && (
                  <h5 className="flex items-center p-1">
                    <div className="flag-avatar mr-2">
                      <figure>
                        <AppImage
                          src={
                            settledMarket[key][0]?.nteamImage ||
                            "/assets/images/flag.png"
                          }
                          width={40}
                          height={40}
                          alt="Team Image"
                        />
                      </figure>
                    </div>
                    <span className="text-black">
                      {settledMarket[key][0]?.teamName}
                      {+inningsId !== 1 &&
                        +inningsId !== 0 &&
                        `, Innings ${inningsId}`}
                    </span>
                  </h5>
                )}
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
                                    className="sidebar-category"
                                  >
                                    <table className="widget-table table settled-table market-table table-striped no-border text-black">
                                      <thead className="sub-category">
                                        <tr>
                                          <th scope="col">
                                            {/* {subCategory?.marketTypeCategori} */}
                                            {subCategory.id ===9 ? "Predict Market": subCategory.marketTypeCategori}
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
              </div>
            </div>
          );
        })}
      </>
    )
  ) : (
    openMarket?.length > 0 && <FullScoreSidebarContentSkeleton login={true} />
  );
};

export default FullScoreSidebar;
