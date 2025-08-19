'use client';

import { OTHER_BALLS } from "@/constants/fullScoreConst";
import { BallDetailsProps, BaseMarketData } from "@/types/full-score/commentary";
import { Runner } from "@/types/market";
import { convertDateUTCToLocal, getBallResultClass, getCommentaryTabRun } from "@/utils/fullscore";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";

export default function BallDetails({
    ball,
    previousBall,
    bowler,
    batsman,
    isShowClient,
    token,
    marketData,
    team1Id,
    team2Id,
    router
}: BallDetailsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCollapseOpen, setIsCollapseOpen] = useState(false);

    const filteredMarketData = marketData?.filter(
        (item: BaseMarketData) => item.commentaryBallByBallId == ball.commentaryBallByBallId && item.rateSource == 2
    )?.sort((a,b)=>a?.id - b?.id);

    const filteredSessionData = marketData?.filter(
        (item: BaseMarketData) => item.commentaryBallByBallId == ball.commentaryBallByBallId && item.rateSource != 2
    )?.sort((a,b)=>a?.id - b?.id);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const toggleCollapse = () => setIsCollapseOpen((prev) => !prev);
    
    const renderMarketRow = (marketItem: BaseMarketData, index: number) => {
        const market: Runner[] = JSON.parse(marketItem.data);
        const team1 = market.find((item) => item.teamId === team1Id);
        const team2 = market.find((item) => item.teamId === team2Id);
        const drawTeam = market.find((item) => item.RunnerName === "The Draw");

        if (!team1 && !team2) return null;

        return (
            <tr key={index}>
                <td>
                    <h6 className="text-xs font-semibold">
                        {marketItem.marketName.toUpperCase().replace("RUNS", "")}
                    </h6>
                </td>
                <td>
                    <div className="text-xs font-semibold flex flex-col items-start">
                        {team1 && <h6>{team1.RunnerName}</h6>}
                        {team2 && <h6>{team2.RunnerName}</h6>}
                        {drawTeam && <h6>{drawTeam.RunnerName}</h6>}
                    </div>
                </td>
                <td>
                    <div className="text-xs flex flex-col">
                        {team1 && (
                            <div className="flex items-center">
                                <div className="lay-price-card lay-radius">{team1.LayPrice}</div>
                                <div className="back-price-card back-radius">{team1.BackPrice}</div>
                            </div>
                        )}
                        {team2 && (
                            <div className="flex items-center my-1">
                                <div className="lay-price-card lay-radius">{team2.LayPrice}</div>
                                <div className="back-price-card back-radius">{team2.BackPrice}</div>
                            </div>
                        )}
                        {drawTeam && (
                            <div className="flex items-center">
                                <div className="lay-price-card lay-radius">{drawTeam.LayPrice}</div>
                                <div className="back-price-card back-radius">{drawTeam.BackPrice}</div>
                            </div>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    const renderSessionRow = (sessionItem: BaseMarketData, index: number) => {
        const sessionValue: Runner[] = JSON.parse(sessionItem.data);
        if (!sessionValue?.[0]) return null;

        return (
            <tr key={index}>
                <td>
                    <h6 className="text-xs font-semibold px-4">
                        {sessionValue[0].RunnerName.toUpperCase().replace("RUNS", "")}
                    </h6>
                </td>
                <td>
                    <div className="flex items-center">
                        <div className="no-rate">
                            <div className="rate-font">{sessionValue[0].LayPrice || "0"}</div>
                            <div className="point-font">{sessionValue[0].LaySize || "0"}</div>
                        </div>
                        <div className="yes-rate">
                            <div className="rate-font">{sessionValue[0].BackPrice || "0"}</div>
                            <div className="point-font">{sessionValue[0].BackSize || "0"}</div>
                        </div>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="ball-detail">
            <div
                className="ball-row bg-white  shadow-sm flex items-center justify-between p-2 mx-2"
            >
                {/* Over Number */}
                <div className="w-1/4 flex items-center">
                <div className="ball-number text-sm font-medium text-gray-700">
                    {parseFloat(ball.overCount).toFixed(1)}
                </div>

                {/* Ball Result */}
                <div className="mx-auto flex justify-center">
                <div
                    className={`ball-result border text-sm font-bold text-center ${getBallResultClass(
                        ball.ballType,
                        ball.ballExtraRun,
                        ball.ballIsBoundry,
                        ball.ballRun,
                        ball.ballIsWicket
                    )}`}
                >
                            {ball && Object.keys(OTHER_BALLS).includes(String(ball.ballType))
                                                                                    ? (ball.ballRun > 0 
                                                                                      ? ball.ballRun + " " : "") + "" +
                                                                                      OTHER_BALLS[ball.ballType as keyof typeof OTHER_BALLS]
                                                                                    : ball.ballIsWicket 
                                                                                      ? previousBall && previousBall.overCount === ball.overCount
                                                                                        ? `${previousBall?.ballRun > 0 ? previousBall.ballRun + " " : ""}${OTHER_BALLS[previousBall?.ballType as keyof typeof OTHER_BALLS] || 0} | W`
                                                                                        : "w"
                                                                                    : ball.ballType == 9 ? "RH"
                                                                                    : ball.ballType == 10 ? ""
                                                                                      : ball.ballRun}
                        </div>
                    </div>
                </div>
                {/* Commentary */}
                <div className="ball-commentary text-sm text-gray-600 w-5/6 flex flex-col">
                    {isShowClient && `${bowler} to ${batsman}, `}
                    {getCommentaryTabRun(ball.ballType, ball.ballIsBoundry, ball.ballRun, ball.ballIsWicket)}.
                    {token && (
                        <span className="timestamp text-xs text-gray-400">
                            {convertDateUTCToLocal(ball.createdDate, "index", "YYYY-MM-DDTHH:mm:ss")}
                        </span>
                    )}
                </div>
                {
                token && filteredMarketData?.length > 0 && (
                    <table className="widget-table table table-striped no-border">
                        <tbody>
                            {filteredMarketData.map(renderMarketRow)}
                        </tbody>
                    </table>
                )
                }
                {(!token && (filteredSessionData.length > 0 || filteredMarketData.length > 0)) ? <div className="flex items-center justify-between space-x-2" onClick={openModal}>
                    <Skeleton width={200} height={30} />
                    <button className="btn" type="button">
                        <img src="/downarrow-dropdown1.svg" alt="Dropdown arrow" className="max-w-none" />
                    </button>
                </div> : null}
                {(token && filteredSessionData.length > 0) ?
                    <button className="btn" type="button" onClick={toggleCollapse}>
                        <img src="/downarrow-dropdown1.svg" alt="Dropdown arrow" className="max-w-none" />
                    </button>: null}
            </div>
            {
                token && filteredSessionData?.length > 0 && isCollapseOpen && (
                    <div className="flex justify-end">
                        <div className="w-fit mr-5">
                        <table className="widget-table table table-striped no-border my-2">
                            <tbody>
                                {filteredSessionData.map(renderSessionRow)}
                            </tbody>
                        </table>
                        </div>
                    </div>
                )
            }

       {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div className="modal-header flex justify-between items-center">
              <h5 className="modal-title text-md text-gray-500">
                Login Required
              </h5>
              <button
                type="button"
                className="btn-close text-gray-500"
                onClick={closeModal}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body py-5 text-center">
              <p>Please login to view Match odds & Session data.</p>
            </div>
            <div className="modal-footer flex justify-center space-x-2">
              <button
                type="button"
                className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
        </div >
    );
}