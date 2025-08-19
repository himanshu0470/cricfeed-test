import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getMatchDetails,
  convertDateTimeUTCToLocal,
  teamRunnerSocket,
} from "@/utils/function";
import { MatchInfoCardProps } from "@/types/cardProps";
import { getFullScorePageUrl } from "@/utils/navigation";
import { useMatchSocket } from "@/hooks/useMatchSocket";
import CountdownTimer from "../countdownComponent/CountdownTimer";
import { getMatchType } from "@/utils/function";
import AppImage from "@/constants/AppImage";

const MatchInfoCard = ({
  match,
  index,
  groupedMatchesLength,
  showResult = false,
  showLocation = false,
  timeTextSize = "xs",
  pages,
  linkURL,
  isSidebar = false,
}: MatchInfoCardProps) => {
  // Initialize socket with initial match data
  const [isTestMatch, setIsTestMatch] = useState(false);
  const [isTimeCount, setIsTimeCount] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [team1Score, setTeam1Score] = useState({});
  const [team2Score, setTeam2Score] = useState({});
  const [animationClass, setAnimationClass] = useState("");
  const [currentStyle, setCurrentStyle] = useState<any>(null);
  const [runnerData, setRunnerData] = useState<any>(null);
  const initialMatchData = {
    ...match,
    url: `${convertDateTimeUTCToLocal(match?.utc)
      .localDate.replace(/\//g, "-")
      .toLowerCase()}/${match?.com
      ?.replace(/\s+/g, "-")
      .toLowerCase()}/${match?.en?.replace(/\s+/g, "-").toLowerCase()}`,
  };

  // Use the socket hook
  const { matchData, marketRunnerData } = !showResult
    ? useMatchSocket({
        commentaryId: String(match.cid),
        eventId: match.eid,
        initialData: initialMatchData,
      })
    : { matchData: match };

  useEffect(() => {
    const checkTime = () => {
      const inputDate = new Date(matchData?.utc);
      const currentDate = new Date();

      // Set state to false if the time has passed, true otherwise
      setIsCompleted(inputDate > currentDate);
    };

    // Run the initial check
    checkTime();

    // Optional: Add a timer to update the state dynamically
    const interval = setInterval(checkTime, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [matchData]);

  // Get updated match details
  const t1MatchDetails = getMatchDetails(matchData?.t1s);
  const t2MatchDetails = getMatchDetails(matchData?.t2s);

  useEffect(() => {
    if (matchData?.tsi?.length > 0) {
      const oldInnings = matchData?.tsi.find((i) => i.inning === 1);
      if (oldInnings) {
        setIsTestMatch(true);
        setTeam1Score(getMatchDetails(oldInnings?.t1s));
        setTeam2Score(getMatchDetails(oldInnings?.t2s));
      }
    }
    setAnimationClass("score-animation");
    setTimeout(() => {
      setAnimationClass("");
      setCurrentStyle(null);
    }, 6000);
  }, [matchData?.tsi]);

  const isCommentary =
    !t1MatchDetails?.runs &&
    !t1MatchDetails?.wickets &&
    !t2MatchDetails?.runs &&
    !t2MatchDetails?.wickets;

  const fullScoreCardUrl =
    linkURL && pages
      ? getFullScorePageUrl({
          pages,
          linkURL,
          match: matchData, // Use updated matchData here
        })
      : "#";

  useEffect(() => {
    if (marketRunnerData) {
      const team1runner = teamRunnerSocket(
        marketRunnerData,
        matchData?.t1id,
        matchData?.t1n
      );
      const team2runner = teamRunnerSocket(
        marketRunnerData,
        matchData?.t2id,
        matchData?.t2n
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
    }
  }, [
    marketRunnerData,
    matchData?.t1id,
    matchData?.t2id,
    matchData?.t1n,
    matchData?.t2n,
  ]);

  const renderMiddleSection = () => {
    if (showResult) {
      if (matchData?.res && !isCommentary) {
        return (
          <div className="flex items-center justify-center">
            {/* <img src="/images/trophy.png" className="trophy-css" alt="trophy" /> */}
            <strong
              className={`${isSidebar ? "result-rmk-side" : "result-rmk"}`}
            >
              {matchData.res}
            </strong>
          </div>
        );
      } else if (isCommentary) {
        return <span className="result">Commentary not available</span>;
      }
      return <span className="result">Winner not available</span>;
    }

    if (showLocation && matchData.loc && new Date(matchData.utc) > new Date()) {
      return <span className="text-xs text-gray-500">{matchData.loc}</span>;
    }
  };

  function startCountdown(targetDateString: any) {
    const targetDate: any = new Date(targetDateString);

    function updateCountdown() {
      const now: any = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsTimeCount(false);
        clearInterval(interval);
        return;
      }
      const twelveHoursInMs = 12 * 60 * 60 * 1000;
      const thirtyMinutesInMs = 30 * 60 * 1000;

      if (difference > thirtyMinutesInMs && difference <= twelveHoursInMs) {
        setIsTimeCount(true);
      } else {
        setIsTimeCount(false);
      }
    }

    const interval = setInterval(updateCountdown, 1000);
  }

  useEffect(() => {
    startCountdown(match.utc);
  }, []);
  // Usage

  const renderTeamSection = (
    teamImage: string,
    teamName: string,
    matchDetails: any,
    teamScore: any,
    pillColor: "brown" | "green",
    isReversed: boolean
  ) => {
    const scoreSection = (
      <>
        {isReversed && match.cst === 4 && match?.twonby && teamName === match?.twonby ? (
          <img
            src="/images/trophy.png"
            className="mb-3 trophy-css"
            alt="trophy"
          />
        ) : null}
        {isTestMatch && isReversed ? (
          <div className="mt-2">
            <div
              className={`score-pill score-pill-${pillColor} ${
                isReversed ? "text-right" : ""
              } bungee-regular text-muted`}
            >
              {teamScore?.runs}/{teamScore?.wickets}
            </div>
            <div
              className={`overs-text-muted ${
                isReversed ? "text-right" : ""
              } bungee-regular`}
            >
              {parseFloat(teamScore?.overs || "0").toFixed(1)} OV
            </div>
          </div>
        ) : null}
        <div>
          <div
            className={`score-pill score-pill-${pillColor} ${
              isReversed ? "text-right" : ""
            } bungee-regular ${isSidebar ? "text-sore-side" : "text-sore"}`}
          >
            {matchDetails?.runs}/{matchDetails?.wickets}
          </div>
          <div
            className={`${isSidebar ? "overs-text-side" : "overs-text"} ${
              isReversed ? "text-right" : ""
            } bungee-regular`}
          >
            {parseFloat(matchDetails?.overs || "0").toFixed(1)} OV
          </div>
        </div>

        {!isReversed && match.cst === 4 && match?.twonby && teamName === match?.twonby ? (
          <img
            src="/images/trophy.png"
            className="mb-3 trophy-css"
            alt="trophy"
          />
        ) : null}
        {isTestMatch && !isReversed ? (
          <div className="mt-2">
            <div
              className={`score-pill score-pill-${pillColor} ${
                isReversed ? "text-right" : ""
              } bungee-regular text-muted`}
            >
              {teamScore?.runs}/{teamScore?.wickets}
            </div>
            <div
              className={`overs-text-muted ${
                isReversed ? "text-right" : ""
              } bungee-regular`}
            >
              {parseFloat(teamScore?.overs || "0").toFixed(1)} OV
            </div>
          </div>
        ) : null}
      </>
    );

    const imageSection = (
      <AppImage
        src={teamImage}
        alt={teamName}
        height={50}
        width={50}
        className={`${isSidebar ? "logo-img-side" : "logo-img"} rounded-full`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/api/placeholder/40/40";
        }}
      />
    );

    return (
      <div
        className={`flex items-center ${
          isReversed ? "justify-end" : ""
        } space-x-2 bungee-regular`}
      >
        {isReversed ? (
          <>
            {scoreSection}
            {imageSection}
          </>
        ) : (
          <>
            {imageSection}
            {scoreSection}
          </>
        )}
      </div>
    );
  };

  return (
    <Link href={fullScoreCardUrl || "#"} rel="canonical">
      <div key={matchData.cid} className="event-match-card">
        <div className="flex items-start justify-between mb-05">
          <div className="flex items-center">
            <strong
              className={`${
                isSidebar ? "eventName-side" : "eventName"
              } uppercase`}
            >
              {matchData.en}
              {/* {newsContent && <br />}  */}
              {/* {matchData.te1n} vs {matchData.te2n} */}
            </strong>
            {/* {mt==="RESULT" ? <strong className="mx-2 date">{convertDateTimeUTCToLocal(matchData?.utc).localDate}{" "}
                        {convertDateTimeUTCToLocal(matchData?.utc).localTime}</strong> : null} */}
            <span>
              {getMatchType(match?.cst) == "LIVE" ? (
                <div className="flex items-center">
                  <span className="ml-2 h-2 w-2 bg-red-500 rounded-full animate-blink"></span>
                  <span className="text-slate-700  font-semibold text-xs ml-1">
                    LIVE
                  </span>
                </div>
              ) : (
                ""
              )}
            </span>
          </div>
          <p
            className={`text-slate-700 border-x border-b border-slate-700 text-[10px] px-1 uppercase`}
          >
            {matchData.com}
          </p>
          {/* <strong className={`${isSidebar ? 'tournament-side' : 'tournament'} uppercase`}>{matchData.com}</strong> */}
        </div>
        <div className="grid grid-cols-12 box-border pb-1">
          <div className="col-span-4 items-center">
            {renderTeamSection(
              matchData?.nte1i || "",
              matchData.te1n,
              t1MatchDetails,
              team1Score,
              "brown",
              false
            )}
            <div
              className={`font-medium mx-2 text-xs text-slate-600 ${
                isSidebar && "matchData-ten"
              } uppercase`}
            >
              {matchData.te1n}
            </div>
            {runnerData?.team1Runner &&
            runnerData?.team2Runner &&
            (runnerData?.team1Runner?.backPrice ||
              runnerData?.team1Runner?.layPrice ||
              runnerData?.team2Runner?.backPrice ||
              runnerData?.team2Runner?.layPrice) ? (
              <div className="grid grid-cols-12 gap-4 mx-2 my-1 items-center">
                <div className="col-span-6 grid grid-cols-2 justify-end">
                  <div className="back-price px-2">
                    {runnerData?.team1Runner?.backPrice}
                  </div>
                  <div className="lay-price px-2">
                    {runnerData?.team1Runner?.layPrice}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="col-span-4 flex flex-col justify-center items-center">
            <div className="flex flex-col text-center space-x-2">
              {/* {isCompleted ? */}
              <span
                className={`text-${timeTextSize} text-gray-600 font-semibold`}
              >
                {convertDateTimeUTCToLocal(matchData?.utc).localTime}
              </span>
              {/* //     : null
                            // } */}
              {renderMiddleSection()}

              {/* <span>{isTimeCount && <CountdownTimer scoreData={matchData} />}</span> */}
            </div>
            <div className="col-span-12 px-2 flex justify-center text-center font-medium mt-2">
              {isTimeCount ? (
                <CountdownTimer scoreData={matchData} />
              ) : !showResult ? (
                <div
                  className="card-aside text-center"
                  style={{ backgroundColor: currentStyle?.backgroundColor }}
                >
                  {matchData?.scov ? (
                    <span className="text-slate-400 mx-2 score-over-font bungee-regular flex justify-center">
                      {matchData?.scov} ov
                    </span>
                  ) : null}

                  {matchData?.dis ? (
                    <div
                      className={`animation-height score-font bungee-regular ${animationClass}`}
                      style={{ color: currentStyle?.color }}
                    >
                      {matchData?.dis == "4" ? (
                        <span className="bungee-regular">FOUR</span>
                      ) : matchData?.dis == "6" ? (
                        <span className="bungee-regular">SIX</span>
                      ) : (
                        <span className="bungee-regular">{matchData?.dis}</span>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-span-4 items-center">
            {/* Team 2 */}

            {renderTeamSection(
              matchData?.nte2i || "",
              matchData.te2n,
              t2MatchDetails,
              team2Score,
              "green",
              true
            )}
            <div
              className={`text-right text-xs font-medium mx-2 text-slate-600 ${
                isSidebar && "matchData-ten"
              } uppercase`}
            >
              {matchData.te2n}
            </div>
            {runnerData?.team1Runner &&
            runnerData?.team2Runner &&
            (runnerData?.team1Runner?.backPrice ||
              runnerData?.team1Runner?.layPrice ||
              runnerData?.team2Runner?.backPrice ||
              runnerData?.team2Runner?.layPrice) ? (
              <div className="grid grid-cols-12 items-center my-1">
                <div className="col-span-6 grid grid-cols-2 mx-2"></div>
                <div className="col-span-6 grid grid-cols-2 mx-2">
                  <div className="back-price px-2">
                    {runnerData?.team2Runner?.backPrice}
                  </div>
                  <div className="lay-price px-2">
                    {runnerData?.team2Runner?.layPrice}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {index < groupedMatchesLength - 1 && (
          <hr className="border-t border-gray-300 mt-1" />
        )}
      </div>
    </Link>
  );
};

export default MatchInfoCard;
