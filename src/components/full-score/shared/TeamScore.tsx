// components/FullScoreContent.tsx

import { useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import Image from "next/image";
import {
  FullScoreContentProps,
  InningDetails,
  ProcessedTeam,
  TeamMatchDetails,
} from "@/types/full-score/teamScore";
import {
  convertDateTimeUTCToLocal,
  getMatchDetails,
  getMatchType,
} from "@/utils/fullscore";
import { TeamInfo } from "@/types/matches";
import AppImage from "@/constants/AppImage";

const FullScoreContent: React.FC<FullScoreContentProps> = ({
  data,
  scoreData,
  runnerData,
  inProgress,
  isChase,
}) => {
  const [isData, setIsData] = useState(true);
  const [isCommentary, setIsCommentary] = useState(false);
  const [percentageLeft, setPercentageLeft] = useState<number | null>(null);
  const [percentageRight, setPercentageRight] = useState<number | null>(null);
  const [percentageDraw, setPercentageDraw] = useState<number | null>(null);
  const [team1Score, setTeam1Score] = useState<TeamMatchDetails>({
    runs: 0,
    wickets: 0,
    overs: 0,
  });
  const [team2Score, setTeam2Score] = useState<TeamMatchDetails>({
    runs: 0,
    wickets: 0,
    overs: 0,
  });
  const [isTestMatch, setIsTestMatch] = useState(false);
  const [currentRunEvent, setCurrentRunEvent] = useState<
    string | number | null
  >(null);
  const [overNo, setOverNo] = useState<string | null>(null);
  const [animationClass, setAnimationClass] = useState("");
  const [currentStyle, setCurrentStyle] = useState<{
    backgroundColor?: string;
    color?: string;
  } | null>(null);
  const [currentOver, setCurrentOver] = useState<any[]>([]);
  const [team1Innings, setTeam1Innings] = useState<InningDetails[]>([]);
  const [team2Innings, setTeam2Innings] = useState<InningDetails[]>([]);
  const currentInningsNumber = useMemo(
    () => scoreData?.cinn || 1,
    [scoreData?.cinn]
  );

  const team1crr = scoreData?.scot === scoreData?.t1sn && scoreData?.crr;
  const team2crr = scoreData?.scot === scoreData?.t2sn && scoreData?.crr;

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title =
        scoreData?.t1n && scoreData?.t2n
          ? `${scoreData.t1n} vs ${scoreData.t2n}`
          : "loading...";
    }
  }, [scoreData?.t1n, scoreData?.t2n]);

  useEffect(() => {
    if (scoreData) {
      setPercentageLeft(parseFloat(scoreData?.tpp1 || "0"));
      setPercentageRight(parseFloat(scoreData?.tpp2 || "0"));
      setPercentageDraw(null);

      if (
        runnerData?.drawRunner?.runner === "The Draw" &&
        scoreData?.com === "Test Matches" &&
        parseFloat(scoreData?.tpp1 || "0") +
          parseFloat(scoreData?.tpp2 || "0") <
          100
      ) {
        const draw =
          100 -
          (parseFloat(scoreData?.tpp1 || "0") +
            parseFloat(scoreData?.tpp2 || "0"));
        setPercentageDraw(draw);
      } else if (
        parseFloat(scoreData?.tpp1 || "0") &&
        parseFloat(scoreData?.tpp2 || "0") &&
        parseFloat(scoreData?.tpp1 || "0") +
          parseFloat(scoreData?.tpp2 || "0") <
          100
      ) {
        const draw =
          100 -
          (parseFloat(scoreData?.tpp1 || "0") +
            parseFloat(scoreData?.tpp2 || "0"));
        if (
          parseFloat(scoreData?.tpp1 || "0") >
          parseFloat(scoreData?.tpp2 || "0")
        ) {
          setPercentageLeft(parseFloat(scoreData?.tpp1 || "0") + draw);
        } else {
          setPercentageRight(parseFloat(scoreData?.tpp2 || "0") + draw);
        }
      }
    }
  }, [scoreData?.tpp1, scoreData?.tpp2, runnerData?.drawRunner]);

  useEffect(() => {
    if (scoreData?.cst === 4 && (scoreData?.t3Id || scoreData?.t4Id)) {
      setIsTestMatch(true);
      setTeam1Score(getMatchDetails(scoreData?.t3MatchDetails));
      setTeam2Score(getMatchDetails(scoreData?.t4MatchDetails));
    }
  }, [scoreData]);

  useEffect(() => {
    if (scoreData?.tsi && scoreData.tsi.length > 0) {
      const team1NewInnings: InningDetails[] = [];
      const team2NewInnings: InningDetails[] = [];

      // Get current innings number
      const currentInningsNumber = scoreData.cinn || 1;

      scoreData.tsi.forEach((inning) => {
        const team1Inning = inning.t1s
          ? (JSON.parse(inning.t1s) as InningDetails)
          : null;
        const team2Inning = inning.t2s
          ? (JSON.parse(inning.t2s) as InningDetails)
          : null;

        if (team1Inning) team1NewInnings.push(team1Inning);
        if (team2Inning) team2NewInnings.push(team2Inning);
      });

      setTeam1Innings(team1NewInnings);
      setTeam2Innings(team2NewInnings);
    }
  }, [scoreData?.tsi, scoreData?.cinn]);

  useEffect(() => {
    setIsData(Boolean(scoreData?.t1n && scoreData?.t2n && scoreData?.com));
  }, [scoreData]);

  useEffect(() => {
    const noScore =
      !parseInt(scoreData?.t1MatchDetails?.runs?.toString() || "0") &&
      !parseInt(scoreData?.t1MatchDetails?.wickets?.toString() || "0") &&
      !parseInt(scoreData?.t1MatchDetails?.overs?.toString() || "0") &&
      !parseInt(scoreData?.t2MatchDetails?.runs?.toString() || "0") &&
      !parseInt(scoreData?.t2MatchDetails?.wickets?.toString() || "0") &&
      !parseInt(scoreData?.t2MatchDetails?.overs?.toString() || "0");

    setIsCommentary(noScore);
  }, [scoreData]);
  useEffect(() => {
    if (scoreData?.currOver?.["currentBall"]) {
      const { actualRun, ocn, isb, isw, bty } = scoreData.currOver.currentBall;
      const currentBall = scoreData?.currOver?.["currentBall"] || {};
      const currOverFromCurrMatch =
        Object.values(scoreData.currOver || {}).pop() || [];
      const status = scoreData?.dis || scoreData?.win;
      if (status && status !== "4" && status !== "6" && status !== "Wicket") {
        setCurrentRunEvent(status);
        setCurrentStyle(null);
        setOverNo(bty !== 0 ? ocn : null);
      } else if (
        !isEqual(currentOver, currOverFromCurrMatch) &&
        (currentBall.isb || currentBall.isw) &&
        bty !== 0
      ) {
        const runData = isb ? actualRun : isw ? "Wicket" : null;
        setCurrentRunEvent(runData);
        setCurrentStyle({
          backgroundColor: isw
            ? scoreData.bowlingTeam.bgColor
            : isb
            ? scoreData.battingTeam.bgColor
            : undefined,
          color: isw
            ? scoreData.bowlingTeam.borderColor
            : isb
            ? scoreData.battingTeam.borderColor
            : undefined,
        });
        setOverNo(ocn);
      }
      setCurrentRunEvent(actualRun);
      setOverNo(ocn);
      setCurrentOver(
        Array.isArray(currOverFromCurrMatch) ? currOverFromCurrMatch : []
      );
      // setAnimationClass("animate-fadeIn");
      setAnimationClass("score-animation");

      const timer = setTimeout(() => {
        setAnimationClass("");
        setCurrentStyle(null);
        setCurrentRunEvent(null);
        setOverNo(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [scoreData?.currOver?.currentBall, scoreData?.dis, scoreData?.win]);

  // useEffect(() => {
  //     // data?.displayStatus == "Wicket" && setCurrentStyle({
  //     //     backgroundColor: isw ? scoreData.bowlingTeam.bgColor : isb ? scoreData.battingTeam.bgColor : undefined,
  //     //     color: isw ? scoreData.bowlingTeam.borderColor : isb ? scoreData.battingTeam.borderColor : undefined
  //     // });
  //     setAnimationClass("score-animation");
  //     // setTimeout(() => {
  //     //     setAnimationClass("");
  //     //     setCurrentStyle(null);
  //     // }, 6000);
  // }, [data])
  const utc = scoreData.utc ?? new Date().toISOString(); // Fallback to current date
  const targetTime = new Date(utc);

  const processTeams = (teams: TeamInfo[]): ProcessedTeam[] => {
    const uniqueTeams = new Map<number, ProcessedTeam>();

    teams.forEach((team) => {
      if (!uniqueTeams.has(team.teamId)) {
        uniqueTeams.set(team.teamId, {
          id: team.teamId,
          name: team.teamName,
          image: team.image,
          shortName: team.shortName,
          innings: [
            {
              score: team.teamScore,
              overs: team.teamOver,
              wickets: team.teamWicket,
            },
          ],
          crr: team.crr,
          rrr: team.rrr,
          color: team.teamColor,
          backgroundColor: team.backgroundColor,
        });
      } else {
        // If team exists, add the innings
        const existingTeam = uniqueTeams.get(team.teamId);
        if (existingTeam) {
          existingTeam.innings.push({
            score: team.teamScore,
            overs: team.teamOver,
            wickets: team.teamWicket,
          });
        }
      }
    });
    return Array.from(uniqueTeams.values());
  };

  if (!isData) {
    return (
      <div className="rounded-lg shadow-md p-2">
        <div className="text-center">
          <strong>There are no matches now</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-md bg-white mb-3">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-9 border-r">
          <div className="">
            {/* Header Row */}
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center space-x-2 top-0">
                <strong className="eventName uppercase">
                  {scoreData?.en} {scoreData?.eno ? `(${scoreData.eno})` : ""}
                </strong>
                <strong className="eventDate">
                  {convertDateTimeUTCToLocal(scoreData?.utc || "").localDate}{" "}
                  {convertDateTimeUTCToLocal(scoreData?.utc || "").localTime}
                </strong>
              </div>
              <span className="text-slate-700 border-x border-b border-slate-700 text-[10px] px-1 uppercase">
                {scoreData?.com}
              </span>
            </div>

            <div className="text-xs text-[#fd2b00] font-semibold mb-1 px-2">
              {getMatchType(scoreData?.cst)}
            </div>

            {/* Score Row */}
            <div className="flex justify-between items-center px-2 py-1">
              {/* Team 1 */}
              <div className="flex items-center w-[40%] lg:w-[40%]">
                <div className="w-12 h-12 relative mr-2 team-img">
                  <AppImage
                    src={scoreData?.nt1im || "/assets/images/flag.png"}
                    alt={scoreData?.t1n || "Team 1"}
                    fill
                    className="object-contain rounded-full border bg-[#eff0f5]"
                  />
                </div>
                <div>
                  <div className="score-update-1 bungee-regular">
                    {currentInningsNumber &&
                    team1Innings[+currentInningsNumber - 1]
                      ? `${team1Innings[+currentInningsNumber - 1].score || 0}/
                   ${team1Innings[+currentInningsNumber - 1].wickets || 0}`
                      : `${scoreData?.t1MatchDetails?.runs || 0}/
                   ${scoreData?.t1MatchDetails?.wickets || 0}`}
                  </div>
                  <div className="text-xs text-gray-500 bungee-regular">
                    {currentInningsNumber &&
                    team1Innings[+currentInningsNumber - 1]
                      ? parseFloat(
                          team1Innings[
                            +currentInningsNumber - 1
                          ].overs?.toString() || "0"
                        ).toFixed(1)
                      : parseFloat(
                          scoreData?.t1MatchDetails?.overs?.toString() || "0"
                        ).toFixed(1)}{" "}
                    ov
                    {/* {team1crr && <span className="ml-2">CRR: {team1crr}</span>} */}
                  </div>
                  {team1Innings
                    .slice(0, +currentInningsNumber - 1)
                    .map((inning: InningDetails, index: number) => (
                      <div key={index} className="text-xs text-gray-500 -mt-1">
                        {inning.score || 0}/{inning.wickets || 0}
                        <span className="text-xs ml-1">
                          (
                          {parseFloat(inning.overs?.toString() || "0").toFixed(
                            1
                          )}
                          ){inning.isSuperOver ? " SO" : ""}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="ml-2 lg:block hidden">
                  {scoreData?.cst && scoreData?.cst !== 4 && team1crr && (
                    <>
                      <span className="text-xs font-medium text-[#777777]">
                        Current RR
                      </span>
                      <br />
                      <span className="text-gray-950 font-semibold text-xs">
                        {team1crr}
                      </span>
                    </>
                  )}
                </div>
                <div>
                  <>
                    {data?.winnerName && data?.winnerId == scoreData?.t1id && scoreData?.res ?  (
                      <div>
                        <img
                          src="/images/trophy.png"
                          className="mb-3 trophy-css"
                          alt="trophy"
                        />
                      </div>
                    ) : null}
                  </>
                </div>
                {/* <div className='mx-2'>
                                    {team1crr && <span className="text-xs font-medium text-[#777777]">Required RR </span>}<br/>
                                    <span className='text-gray-950 font-medium text-xs'>{team1crr}</span>
                                </div> */}
              </div>

              {/* Match Status */}
              <div className="w-[20%] lg:w-[30%] text-center">
                {
                  scoreData?.cst === 4 && scoreData?.res ? (
                    <div className="text-sm font-medium">{scoreData.res}</div>
                  ) : scoreData?.res ? (
                    <strong className="font-semibold text-xs text-[#007bff]">
                      {scoreData.res}
                    </strong>
                  ) : null
                  // (
                  //     <div className="text-sm font-semibold text-slate-500">
                  //         {isCommentary ? "Commentary not available" :
                  //             scoreData?.cst === 4 ? "Winner not available" :
                  //             scoreData?.loc
                  //             }
                  //     </div>
                  // )
                }
              </div>

              {/* Team 2 */}
              <div className="flex items-center justify-end w-[40%] lg:w-[30%]">
                <div>
                  <>
                    {data?.winnerName && data?.winnerId == scoreData?.t2id && scoreData?.res ? (
                      <div>
                        <img
                          src="/images/trophy.png"
                          className="mb-3 trophy-css"
                          alt="trophy"
                        />
                      </div>
                    ) : null}
                  </>
                </div>
                <div className=" mr-2">
                  <div className="score-update-1 bungee-regular">
                    {currentInningsNumber &&
                    team2Innings[+currentInningsNumber - 1]
                      ? `${team2Innings[+currentInningsNumber - 1].score || 0}/
                   ${team2Innings[+currentInningsNumber - 1].wickets || 0}`
                      : `${scoreData?.t2MatchDetails?.runs || 0}/
                   ${scoreData?.t2MatchDetails?.wickets || 0}`}
                  </div>
                  <div className="text-xs text-gray-600 bungee-regular">
                    {currentInningsNumber &&
                    team2Innings[+currentInningsNumber - 1]
                      ? parseFloat(
                          team2Innings[
                            +currentInningsNumber - 1
                          ].overs?.toString() || "0"
                        ).toFixed(1)
                      : parseFloat(
                          scoreData?.t2MatchDetails?.overs?.toString() || "0"
                        ).toFixed(1)}{" "}
                    ov
                    {/* {team2crr && <span className="ml-2">CRR: {team2crr}</span>} */}
                  </div>
                  {team2Innings
                    .slice(0, +currentInningsNumber - 1)
                    .map((inning: InningDetails, index: number) => (
                      <div key={index} className="text-xs text-gray-500 -mt-1">
                        {inning.score || 0}/{inning.wickets || 0}
                        <span className="text-xs ml-1">
                          (
                          {parseFloat(inning.overs?.toString() || "0").toFixed(
                            1
                          )}
                          ){inning.isSuperOver ? " SO" : ""}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="w-12 h-12 relative team-img">
                  <AppImage
                    src={scoreData?.nt2im || "/assets/images/flag.png"}
                    alt={scoreData?.t2n || "Team 2"}
                    fill
                    className="object-contain rounded-full border bg-[#eff0f5]"
                  />
                </div>
              </div>
            </div>

            {/* Extra Info Row */}
            {/* {((team1crr || team2crr) && inProgress) && (
                            <div className="flex justify-between items-center px-2 mt-1">
                                <div className="text-xs">
                                    {team1crr && (
                                        <span className="text-gray-600">
                                            CRR: {team1crr}
                                            {isChase && scoreData?.rrr && (
                                                <span className="ml-2">RRR: {scoreData.rrr}</span>
                                            )}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs">
                                    {team2crr && (
                                        <span className="text-gray-600">
                                            CRR: {team2crr}
                                            {isChase && scoreData?.rrr && (
                                                <span className="ml-2">RRR: {scoreData.rrr}</span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )} */}

            {/* Team Status Row */}
            <div className="flex justify-between items-center px-2 pb-1">
              <div className="flex items-center team">
                <span className="">{scoreData?.t1n}</span>
                {scoreData?.t1id &&
                  scoreData?.ballid &&
                  scoreData?.t1id === scoreData?.ballid && (
                    <Image
                      src="/assets/images/bowling-old.png"
                      alt="Bowling"
                      width={12}
                      height={12}
                      className="ml-1"
                    />
                  )}
                {scoreData?.t1id &&
                  scoreData?.batid &&
                  scoreData?.t1id === scoreData?.batid && (
                    <Image
                      src="/images/bat.png"
                      alt="Batting"
                      width={12}
                      height={12}
                      className="ml-1"
                    />
                  )}
              </div>
              <div className="flex items-center team">
                {scoreData?.t2id &&
                  scoreData?.ballid &&
                  scoreData?.t2id === scoreData?.ballid && (
                    <Image
                      src="/assets/images/bowling-old.png"
                      alt="Bowling"
                      width={12}
                      height={12}
                      className="mr-1"
                    />
                  )}
                {scoreData?.t2id &&
                  scoreData?.batid &&
                  scoreData?.t2id === scoreData?.batid && (
                    <Image
                      src="/images/bat.png"
                      alt="Batting"
                      width={12}
                      height={12}
                      className="mr-1"
                    />
                  )}
                <span className="">{scoreData?.t2n}</span>
              </div>
            </div>

            {runnerData?.team1Runner &&
            runnerData?.team2Runner &&
            scoreData?.cst !== 4 &&
            (runnerData?.team1Runner?.backPrice ||
              runnerData?.team1Runner?.layPrice ||
              runnerData?.team2Runner?.backPrice ||
              runnerData?.team2Runner?.layPrice) ? (
              <div className="flex justify-between px-2 pb-1">
                <div className="flex">
                  <span className="back-price rounded text-xs">
                    {runnerData.team1Runner.backPrice}
                  </span>
                  <span className="lay-price rounded text-xs">
                    {runnerData.team1Runner.layPrice}
                  </span>
                </div>

                {runnerData.drawRunner && (
                  <div className="flex items-center">
                    <span className="text-xs text-gray-600 mr-2">Draw</span>
                    <span className="back-price rounded text-xs">
                      {runnerData.drawRunner.backPrice}
                    </span>
                    <span className="lay-price rounded text-xs">
                      {runnerData.drawRunner.layPrice}
                    </span>
                  </div>
                )}

                <div className="flex">
                  <span className="back-price rounded text-xs">
                    {runnerData.team2Runner.backPrice}
                  </span>
                  <span className="lay-price rounded text-xs">
                    {runnerData.team2Runner.layPrice}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Win Probability Bar */}
            {((percentageLeft && percentageRight) ||
              ((runnerData?.team1Runner || runnerData?.team2Runner) &&
                runnerData?.drawRunner?.runner === "The Draw")) &&
              scoreData?.cst !== 4 && (
                <div className="mt-1 px-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="flex h-full transition-all ease-in-out duration-300">
                      <div
                        style={{
                          width: `${percentageLeft ?? 0}%`,
                          backgroundColor: scoreData?.t1co,
                          // backgroundColor: (percentageLeft ?? 0) > (percentageRight ?? 0) ? 'green' : 'red',
                        }}
                      />
                      {percentageDraw && (
                        <div
                          style={{
                            width: `${percentageDraw}%`,
                            backgroundColor: "gray",
                          }}
                        />
                      )}
                      <div
                        style={{
                          width: `${percentageRight ?? 0}%`,
                          backgroundColor: scoreData?.t2co,
                          // backgroundColor: (percentageRight ?? 0) > (percentageLeft ?? 0) ? 'green' : 'red',
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-0.5 text-[10px] text-gray-600">
                    <span>({percentageLeft ?? 0}%)</span>
                    {percentageDraw ? (
                      <span>Draw {percentageDraw}%</span>
                    ) : (
                      <span>Realtime Win %</span>
                    )}
                    <span>({percentageRight ?? 0}%)</span>
                  </div>
                </div>
              )}

            {/* Live Updates Section */}
            {/* {inProgress && currentRunEvent && (
                            <div
                                className="absolute right-0 top-0 w-16 flex flex-col items-center justify-center p-1"
                                style={{ backgroundColor: currentStyle?.backgroundColor }}
                            >
                                {overNo && (
                                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs mb-1">
                                        {overNo} ov
                                    </span>
                                )}
                                <div
                                    className={`flex items-center justify-center h-12 text-base font-bold ${animationClass}`}
                                    style={{ color: currentStyle?.color }}
                                >
                                    {currentRunEvent === 4 ? 'FOUR' :
                                        currentRunEvent === 6 ? 'SIX' :
                                            currentRunEvent}
                                </div>
                            </div>
                        )} */}
          </div>
        </div>
        <div className="col-span-12 md:col-span-3 hidden lg:block h-full">
          {inProgress && (
            <div
              className="card-aside h-full text-center"
              style={{ backgroundColor: currentStyle?.backgroundColor }}
            >
              {/* {scoreData?.scov ? <span className="overCount text-slate-400 text-xs mx-2 my-2 bungee-regular flex justify-center">{scoreData?.scov} ov</span> : null}
                        {data?.displayStatus ? (
                            <div className={`animation-height score-font bungee-regular ${animationClass}`} style={{ color: currentStyle?.color }}>
                                {data?.displayStatus == "4" ? <span className='bungee-regular'>FOUR</span> : data?.displayStatus == "6" ? <span className='bungee-regular'>SIX</span> : <span className='bungee-regular'>{data?.displayStatus}</span>}
                            </div>
                        ) : null} */}
              {inProgress && currentRunEvent && (
                <div
                  className="flex flex-col items-center justify-center h-full"
                  style={{ backgroundColor: currentStyle?.backgroundColor }}
                >
                  {overNo && (
                    <div className="h-[20%] flex items-center justify-center px-1.5 py-0.5 rounded text-xs bungee-regular">
                      {overNo} ov
                    </div>
                  )}
                  <div
                    className={`flex-1 flex items-center justify-center text-base font-bold bungee-regular ${animationClass}`}
                    style={{ color: currentStyle?.color }}
                  >
                    {/* {scoreData?.currOver?.["currentBall"].actualRun === 4 ? 'FOUR' :
                                        scoreData?.currOver?.["currentBall"].actualRun === 6 ? 'SIX' : 
                                        scoreData?.currOver?.["currentBall"].isw ? "Wicket" : 
                                        scoreData?.currOver?.["currentBall"].actualRun} */}
                    {scoreData.dis}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullScoreContent;
