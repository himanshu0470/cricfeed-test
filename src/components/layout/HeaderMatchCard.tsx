import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMatchDetails, teamRunnerSocket, convertDateTimeUTCToLocal, getMatchType } from '@/utils/function';
import { RESULT } from '@/constants/socketConstants';
import { useApp } from '@/app/providers';
import { getFullScorePageUrl } from '@/utils/navigation';
import { FULL_SCORE_COMPONENT } from '@/constants/fullScoreConst';
import { useMatchSocket } from '@/hooks/useMatchSocket';
import { MarketRunner, MatchCardProps, MatchDetails } from '@/types/cardProps';
import "../../app/globals.css"
import AppImage from '@/constants/AppImage';

export const HeaderMatchCard = ({ match, type, removeCard }: MatchCardProps) => {
    const { initialData } = useApp();
    const pages = initialData?.pages || [];

    const [team1Score, setTeam1Score] = useState<MatchDetails>({});
    const [team2Score, setTeam2Score] = useState<MatchDetails>({});
    const [isTestMatch, setIsTestMatch] = useState(false);
    const [marketRunner, setMarketRunner] = useState<MarketRunner | null>(null);
    const [currentMatchData, setCurrentMatchData] = useState(match);

    const initialMatchData = {
        ...match,
        url: `${convertDateTimeUTCToLocal(match?.utc).localDate.replace(/\//g, "-").toLowerCase()}/${match?.com.replace(/\s+/g, "-").toLowerCase()}/${match?.en.replace(/\s+/g, "-").toLowerCase()}`,
        details1: getMatchDetails(match?.t1s),
        details2: getMatchDetails(match?.t2s),
    };

    const { matchData, marketRunnerData } = useMatchSocket({
        eventId: String(match.cid),
        commentaryId: String(match.cid),
        initialData: initialMatchData
    });

    useEffect(() => {
      if (matchData) {
          setCurrentMatchData(matchData);
      }
    }, [matchData]);

    const fullScoreCardUrl = getFullScorePageUrl({
        pages,
        linkURL: FULL_SCORE_COMPONENT,
        match
    }) || "";

    // Test match data handling
    useEffect(() => {
        if (Array.isArray(currentMatchData?.tsi) && currentMatchData.tsi.length > 0) {
            const firstInning = currentMatchData.tsi.find(i => i.inning === 1);
            if (firstInning) {
                setIsTestMatch(true);
                setTeam1Score(getMatchDetails(firstInning.t1s));
                setTeam2Score(getMatchDetails(firstInning.t2s));
            }
        }
    }, [currentMatchData?.tsi]);

    // Match status handling
    useEffect(() => {
        if (getMatchType(currentMatchData?.cst) === RESULT.toUpperCase() && removeCard) {
            removeCard(currentMatchData.cid);
        }
    }, [currentMatchData?.cst, currentMatchData.cid, removeCard]);

    // Market runner processing
    useEffect(() => {
        if (Array.isArray(marketRunnerData) && marketRunnerData.length > 0) {
            const team1runner = teamRunnerSocket(marketRunnerData, currentMatchData?.t1id, currentMatchData?.te1n);
            const team2runner = teamRunnerSocket(marketRunnerData, currentMatchData?.t2id, currentMatchData?.te2n);
            const draw = marketRunnerData.find(item => item.runner === "The Draw");

            if (draw?.backPrice && draw.backPrice < 2) {
                setMarketRunner({ ...draw, teamName: "Draw" });
            } else if (team1runner?.backPrice &&
                (team1runner.backPrice < (team2runner?.backPrice || Infinity) ||
                    team1runner.backPrice < 2)) {
                setMarketRunner(team1runner);
            } else if (team2runner?.backPrice &&
                (team2runner.backPrice < (team1runner?.backPrice || Infinity) ||
                    team2runner.backPrice < 2)) {
                setMarketRunner(team2runner);
            }
        }
    }, [marketRunnerData, currentMatchData?.t1id, currentMatchData?.t2id, currentMatchData?.te1n, currentMatchData?.te2n]);

    const formatOvers = (overs: string | undefined) => {
        return parseFloat(overs || "0").toFixed(1);
    };

    const t1MatchDetails = getMatchDetails(currentMatchData?.t1s);
    const t2MatchDetails = getMatchDetails(currentMatchData?.t2s);

    return (
    <Link href={fullScoreCardUrl} rel="canonical">
      <div className="match-card hover:shadow-md transition-shadow">
        <div className="bg-white rounded-lg relative">
          {/* Match Content */}
          <div className="scorecard-score">
            {/* Match Title and Time */}
            <div className="flex justify-between items-center mx-2 py-2">
              <span
                className="event-name overflow-hidden text-ellipsis max-w-[200px] whitespace-nowrap"
                title={currentMatchData.en}
              >
                {currentMatchData.en}
              </span>
              <span className="date text-sm">{currentMatchData.ed}</span>
            </div>

            {/* Teams and Scores */}
            <div className="grid grid-cols-2">
              {/* Team 1 */}
              <div className="flex items-center">
                {/* <img
                  src={currentMatchData.te1i}
                  alt={currentMatchData.te1n}
                  className="team-logo1 rounded-full w-full h-full object-cover bg-[#eff0f5]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/api/placeholder/48/48";
                  }}
                /> */}
                <AppImage
                  src={currentMatchData?.nte1i || ""}
                  alt={currentMatchData.te1n}
                  width={50}
                  height={50}
                  className="team-logo1 rounded-full w-full h-full object-cover bg-[#eff0f5]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/api/placeholder/48/48";
                  }}
                />
                <div className="score1">
                  <div
                    className="team1-score"
                    style={{
                      background: `transparent linear-gradient(270deg, ${currentMatchData.t1co}, #040404) 0 0 no-repeat padding-box`,
                      border: `4px solid ${currentMatchData.t1bg}`,
                    }}
                  >
                    <span className="bungee-regular">
                      {t1MatchDetails?.runs}-{t1MatchDetails?.wickets}
                    </span>
                    {/* Show First innings score if present */}
                    {isTestMatch && (
                      <div className="text-[10px] ml-[-5px] text-white opacity-70 -mt-0.5 -mb-0.5 pl-1 leading-none">
                        {team1Score?.runs}-{team1Score?.wickets}
                      </div>
                    )}
                  </div>
                  <div
                    className="team1"
                    style={{
                      background: `${currentMatchData.t1bg} 0 0 no-repeat padding-box`,
                    }}
                  >
                    <span
                      className="bungee-regular"
                      style={{ color: `${currentMatchData.t1co}` }}
                    >
                      {parseFloat(t1MatchDetails?.overs || "0").toFixed(1)} ov
                    </span>
                  </div>
                </div>
              </div>

              {/* Team 2 */}
              <div className="flex items-center justify-end">
                <div className="score2">
                  <div
                    className="team2-score"
                    style={{
                      background: `transparent linear-gradient(89deg, ${currentMatchData.t2co}, #040404) 0 0 no-repeat padding-box`,
                      border: `4px solid ${currentMatchData.t2bg}`,
                    }}
                  >
                    <span className="bungee-regular">
                      {t2MatchDetails?.runs}-{t2MatchDetails?.wickets}
                    </span>
                    {/* Show First innings score if present */}
                    {isTestMatch && (
                      <div className="text-[10px] mr-[-5px] text-white opacity-70 -mt-0.5 -mb-0.5 pr-1 leading-none text-right">
                        {team2Score?.runs}-{team2Score?.wickets}
                      </div>
                    )}
                  </div>
                  <div
                    className="team2"
                    style={{
                      background: `${currentMatchData.t2bg} 0 0 no-repeat padding-box`,
                    }}
                  >
                    <span
                      className="bungee-regular"
                      style={{ color: `${currentMatchData.t2co}` }}
                    >
                      {parseFloat(t2MatchDetails?.overs || "0").toFixed(1)} ov
                    </span>
                  </div>
                </div>
                {/* <img
                  src={currentMatchData.te2i}
                  alt={currentMatchData.te2n}
                  className="team-logo2 rounded-full w-full h-full object-cover bg-[#eff0f5]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/api/placeholder/48/48";
                  }}
                /> */}
                <AppImage
                  src={currentMatchData?.nte2i || ""}
                  alt={currentMatchData.te2n}
                  width={50}
                  height={50}
                  className="team-logo2 rounded-full w-full h-full object-cover bg-[#eff0f5]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/api/placeholder/48/48";
                  }}
                />
              </div>
            </div>

            {/* Team Names */}
            <div className="grid grid-cols-3 event-top">
              <div className="flex items-center justify-center -mt-1">
                <span className="text-tournament">{currentMatchData.s1n}</span>
                {currentMatchData?.t1id &&
                  currentMatchData?.ballid &&
                  currentMatchData?.t1id == currentMatchData?.ballid && (
                    <img
                      className="bowl-logo ml-1"
                      src={"/images/bowl.png"}
                      alt=""
                    />
                  )}
                {currentMatchData?.t1id && currentMatchData?.batid && currentMatchData?.t1id == currentMatchData?.batid && (
                  <img
                    className="bat-logo ml-1"
                    src={"/images/bat.png"}
                    alt=""
                  />
                )}
              </div>
              <div className="flex items-center date text-sm text-center">
                {type === "Live"
                  ? convertDateTimeUTCToLocal(currentMatchData?.utc).localTime
                  : ""}
              </div>
              <div className="flex items-center justify-center -mt-1">
                {currentMatchData?.t2id &&
                  currentMatchData?.ballid &&
                  currentMatchData?.t2id == currentMatchData?.ballid && (
                    <img
                      className="bowl-logo mr-1"
                      src={"/images/bowl.png"}
                      alt=""
                    />
                  )}
                {currentMatchData?.t2id && currentMatchData?.batid && currentMatchData?.t2id == currentMatchData?.batid && (
                  <img
                    className="bat-logo mr-1"
                    src={"/images/bat.png"}
                    alt=""
                  />
                )}
                <span className="text-tournament">{currentMatchData.s2n}</span>
              </div>
            </div>

            {/* Tournament Badge */}
            <div className="flex items-center justify-between">
              <span className="tournament top-card text-white text-xs px-4 py-1 rounded-lg absolute bottom-0 left-0">
                {currentMatchData.com}
              </span>
              {currentMatchData?.loc && (
                <span className="text-sm text-gray-500 mx-2 absolute bottom-0 right-0 hidden">
                  {currentMatchData?.loc}
                </span>
              )}
              {marketRunnerData?.length > 0 && marketRunner && (
                <div className="flex items-center text-xs rounded-lg absolute bottom-0 right-0">
                  <div className="runner-team-card">
                    {marketRunner?.teamName}
                  </div>
                  <div className="flex items-center mx-2">
                    <div className="back-price-card back-price-radius px-2">
                      {marketRunner?.backPrice}
                    </div>
                    <div className="lay-price-card lay-price-radius px-2">
                      {marketRunner?.layPrice}
                    </div>
                  </div>
                </div>
              )}
            </div>
                    {/* <div className="flex items-center justify-between">
                            <span className="tournament top-card">
                                {matchData?.com}
                            </span>
                            {marketRunnerData?.length > 0 && marketRunner && (
                                <div className="flex items-center">
                                    <div className="runner-team-card">
                                        {marketRunner.teamName}
                                    </div>
                                    <div className="flex items-center mx-2">
                                        <div className="back-price-card back-price-radius px-2">
                                            {marketRunner.backPrice}
                                        </div>
                                        <div className="lay-price-card lay-price-radius px-2">
                                            {marketRunner.layPrice}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isTestMatch && (
                            <div className="test-match-info mt-2 text-sm">
                                <div className="flex justify-between">
                                    <span>
                                        {team1Score?.runs}/{team1Score?.wickets} ({formatOvers(team1Score?.overs)})
                                    </span>
                                    <span>
                                        {team2Score?.runs}/{team2Score?.wickets} ({formatOvers(team2Score?.overs)})
                                    </span>
                                </div>
                            </div>
                        )} */}
          </div>
        </div>
      </div>
    </Link>
    );
};

export default HeaderMatchCard;