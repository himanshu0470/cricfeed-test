// @ts-nocheck
import {
  ScoreCardBattingData,
  ScoreCardPlayer,
  ScoreCardProps,
} from "@/types/full-score/scorecard";
import { formatCricketData } from "@/utils/fullscore";
import { useEffect, useMemo, useState } from "react";
import PlayerImage from "../shared/PlayerImage";
// import Image from "next/image";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Avatar,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AppImage from "@/constants/AppImage";
import { isEmpty } from "lodash";

export default function ScoreCard({
  scoreCardData /* imgBaseUrl */,
}: ScoreCardProps) {
  const [hiddenDivIndex, setHiddenDivIndex] = useState([]); // Track which div is hidden

  const handleDivClick = (index) => {
    setHiddenDivIndex((prev) => {
      if (prev.includes(index)) {
        // If the index is already in the array, remove it
        return prev.filter((item) => item !== index);
      } else {
        // If the index is not in the array, add it
        return [...prev, index];
      }
    });
  };
  const getWicketType = (type?: number) => {
    const wicketType = {
      1: "Bowled",
      2: "Catch",
      3: "Stump",
      4: "Hit Wicket",
      5: "LBW",
      6: "Run Out",
      7: "Retired Out",
      8: "Timed Out",
      9: "Hit Ball Twice",
      10: "Obstruct the Fielding",
    };
    return wicketType[type];
  };
  const formattedData = formatCricketData(scoreCardData);
  const getDidNotBat = (
    squad: ScoreCardPlayer[],
    battingOrder: ScoreCardBattingData[]
  ) =>
    squad
      ?.filter(
        (player) =>
          player.isInPlayingEleven &&
          !battingOrder?.some(
            (batter) => batter.commentaryPlayerId === player.commentaryPlayerId
          )
      )
      .sort((a, b) => a.ord - b.ord);

  const getPlayerImage = useMemo(() => (playerId: string) => {
    const allPlayers = [...formattedData.sqt1, ...formattedData.sqt2];
    const jerseyPlayerImage = allPlayers.find(
      (player) => +player.commentaryPlayerId === +playerId
    )?.jerseyPlayerImagePath;
    // return `${imgBaseUrl}${jerseyPlayerImage}`;
    return jerseyPlayerImage;
  }, [formattedData.sqt1, formattedData.sqt2]);


  const getTeamJersey = (teamId: string) => {
    return formattedData.team1Id === teamId
      ? formattedData.t1jr
      : formattedData.t2jr;
  };
  const getInningsData = (innings: number) => {
    const inningsKey = `cci${innings}` as keyof typeof formattedData.cci;
    return formattedData.cci?.[inningsKey];
  };

  if (!formattedData.td.length) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-center text-gray-600">Match has not started yet</p>
      </div>
    );
  }
  const getOppositeTeam = (teams: any[], teamId: number) => {
    return teams.find((team) => team.teamId !== teamId).teamId;
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
      {formattedData.td
        .sort((a, b) => b.teamBattingOrder - a.teamBattingOrder)
        .map((team, index) => {
          const inningsData = getInningsData(team.currentInnings);
          let battingData = [];
          let bowlingData = [];
          let fallOfWickets = [];
          if (
            formattedData.es.currentInnings === 2 &&
            team.currentInnings === 1
          ) {
            battingData =
              +team.teamId === +formattedData?.prevBaid
                ? inningsData?.bat1
                : inningsData?.bat2;
            bowlingData =
              +team.teamId === +formattedData?.prevBoid
                ? inningsData?.bow1
                : inningsData?.bow2;
            fallOfWickets =
              +team.teamId === +formattedData?.prevBaid
                ? inningsData?.fow1
                : inningsData?.fow2;
          } else {
            battingData =
              +team.teamId === +formattedData.baid
                ? inningsData?.bat1
                : inningsData?.bat2;
            bowlingData =
              +team.teamId === +formattedData.boid
                ? inningsData?.bow1
                : inningsData?.bow2;
            fallOfWickets =
              +team.teamId === +formattedData.baid
                ? inningsData?.fow1
                : inningsData?.fow2;
          }
          const squad =
            +team.commentaryTeamId === +formattedData?.t1id ||
            +team.commentaryTeamId === +formattedData?.t3id
              ? formattedData.sqt1
              : formattedData.sqt2;

          const didNotBat = getDidNotBat(squad, battingData || []);
          return (
            !isEmpty(battingData) && (
              <Accordion
                key={index}
                defaultExpanded={index === 0 ? true : false}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  className="batsmen-header h-0"
                >
                  <div className="relative w-10 h-10 flex items-center">
                    <AppImage
                      src={team?.nimage || "/images/default-team.png"}
                      alt={team.teamName}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-sm font-bold pl-2">{team.teamName}</h2>
                </AccordionSummary>
                <div className={`bg-white  rounded-lg shadow overflow-hidden`}>
                  {/* Team Header */}
                  {/* <div className="headContainer batsmen-header flex justify-between items-center space-x-4 border-b">
                <div className="flex items-center">
                  <div className="relative w-10 h-10">
                    <Image
                      src={team.image || "/images/default-team.png"}
                      alt={team.teamName}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-lg font-semibold">{team.teamName}</h2>
                </div>
                <div onClick={() => handleDivClick(index)}>
                  <ChevronDown />
                </div>
              </div> */}

                  {/* Batting Section */}
                  <div className={`overflow-x-auto`}>
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batsmen
                          </th>
                          <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase"></th>
                          <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            R
                          </th>
                          <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            B
                          </th>
                          <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 lowercase">
                            4s
                          </th>
                          <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 lowercase">
                            6s
                          </th>
                          <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            SR
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {battingData
                          ?.sort((a, b) => a.batterOrder - b.batterOrder)
                          .map((batter, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-1">
                                <div className="flex items-center">
                                  <div className="relative w-8 h-8">
                                    {/* <PlayerImage
                                  width="40px"
                                  playerImage={getPlayerImage(batter?.commentaryPlayerId)}
                                  jerseyImage={getTeamJersey(batter?.teamId)}
                                /> */}
                                    <AppImage
                                      src={getPlayerImage(
                                        batter?.commentaryPlayerId
                                      )}
                                      alt="Player"
                                      width={32}
                                      height={30}
                                    />
                                  </div>
                                  <span
                                    className={`ml-3 ${
                                      !batter.wicketType ? "font-medium" : ""
                                    }`}
                                  >
                                    {batter.playerName}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-1 text-sm text-gray-500">
                                {batter.wicketType &&
                                  getWicketType(batter.wicketType)}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {batter.batRun || 0}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {batter.batBall || 0}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {batter.batFour || 0}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {batter.batSix || 0}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {batter.batsmanStrikeRate
                                  ? parseFloat(
                                      String(batter.batsmanStrikeRate)
                                    ).toFixed(2)
                                  : "0.00"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Extra Info Section */}
                  <div className="p-4 space-y-3 bg-gray-50 border-t border-b">
                    {didNotBat && didNotBat.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Did not bat: </span>
                        {didNotBat.map((player, idx) => (
                          <span key={player.commentaryPlayerId}>
                            {player.playerName}
                            {idx !== didNotBat.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    )}

                    {fallOfWickets && fallOfWickets.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Fall of Wickets: </span>
                        {fallOfWickets.map((wicket, idx) => (
                          <span key={idx}>
                            {wicket.teamScore}-{wicket.wicketCount} (
                            {wicket.batterName})
                            {idx !== fallOfWickets.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bowling Section */}
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase">
                            Bowlers
                          </th>
                          <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            O
                          </th>
                          <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            M
                          </th>
                          <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            R
                          </th>
                          <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            W
                          </th>
                          <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            Econ
                          </th>
                          {/* <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                        0s
                      </th> */}
                          <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            4s
                          </th>
                          <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            6s
                          </th>
                          <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            WD
                          </th>
                          <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 uppercase">
                            NB
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bowlingData
                          ?.filter(
                            (bowler) => parseFloat(bowler.bowlerOver) > 0
                          )
                          ?.sort((a, b) => a.bowlerOrder - b.bowlerOrder)
                          ?.map((bowler, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-1">
                                <div className="flex items-center">
                                  <div className="relative w-8 h-8">
                                    {/* <PlayerImage
                                  width="40px"
                                  playerImage={getPlayerImage(bowler?.commentaryPlayerId)}
                                  jerseyImage={getTeamJersey(getOppositeTeam(formattedData?.td, bowler?.teamId))}
                                /> */}
                                    <AppImage
                                      src={getPlayerImage(
                                        bowler?.commentaryPlayerId
                                      )}
                                      alt="Player"
                                      width={32}
                                      height={30}
                                    />
                                  </div>
                                  <span className="ml-1">
                                    {bowler.playerName}
                                    {bowler.isPlay ? "*" : ""}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-1 text-center font-medium">
                                {bowler.bowlerOver
                                  ? parseFloat(
                                      String(bowler.bowlerOver)
                                    ).toFixed(1)
                                  : "0.0"}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {bowler.bowlerMaidenOver || 0}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {bowler.bowlerRun || 0}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {bowler.bowlerTotalWicket || 0}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {bowler.bowlerEconomy
                                  ? parseFloat(
                                      String(bowler.bowlerEconomy)
                                    ).toFixed(2)
                                  : "0.00"}
                              </td>
                              {/* <td className="px-4 py-1 text-center">
                            {bowler.bowlerRun || 0}
                          </td> */}
                              <td className="px-4 py-1 text-center">
                                {bowler.bowlerFour || 0}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {bowler.bowlerSix || 0}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {bowler.bowlerWideBall || 0}
                              </td>
                              <td className="px-4 py-1 text-center">
                                {bowler.bowlerNoBall || 0}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Accordion>
            )
          );
        })}
    </div>
    //   </AccordionDetails>
    // </Accordion>
  );
}
