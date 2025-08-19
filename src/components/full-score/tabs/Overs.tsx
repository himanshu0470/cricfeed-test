// @ts-nocheck
import React, { useEffect, useState } from "react";
// import Image from "next/image";
import { cn } from "@/lib/utils";
import OversSkeleton from "@/components/skeleton/full-score/overs";
import PlayerImage from "../shared/PlayerImage";
import { BALL_TYPE_OVER_COMPLETE, OTHER_BALLS } from "@/constants/fullScoreConst";
import { BallByBallCommentary, OverInfo } from "@/types/matches";
import { Player, TeamData } from "@/types/full-score/fullScore";
import { getRunClass } from "@/utils/fullscore";
import { OversProps } from "@/types/full-score/overs";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Avatar,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AppImage from "@/constants/AppImage";

export const OversTab = ({ OversData, loading, isShowClient = false, /* imgBaseUrl */ }: OversProps) => {
  const [players, setPlayers] = useState<Player[]>();
  const [teamsData, setTeamsData] = useState<TeamData[]>();
  const [oversDetails, setOversDetails] = useState<{ [key: string]: OverInfo[] }>();
  const [currentBowlingTeam, setCurrentBowlingTeam] = useState<string>();
  const [currentBattingTeam, setCurrentBattingTeam] = useState<string>();

  const findPlayer = (playerId: string) => {
    return players?.find((val) => val.commentaryPlayerId === playerId)?.playerName;
  };

  const PlayerImages = (playerId: string) => {
    const jerseyPlayerImage = players?.find((val) => val.commentaryPlayerId === playerId)?.jerseyPlayerImagePath;
    // return `${imgBaseUrl}${jerseyPlayerImage}`
    return jerseyPlayerImage;
  };

  const teamJersay = (teamId: string) => {
    return teamsData?.find((val) => val.teamId === teamId)?.jersey;
  };

  const TeamName = (teamId: string) => {
    return teamsData?.find((val) => val.teamId !== teamId);
  };

  const findPreviousScore = (overs: Over[], currentIndex: number): string => {
    if (!overs || currentIndex < 0) return "NaN";

    for (let i = currentIndex + 1; i < overs.length; i++) {
      const prevOver = overs[i];
      if (prevOver?.teamScore !== null) {
        return prevOver.teamScore.toString();
      }
    }
    return "NaN";
  };

  useEffect(() => {
    if (!OversData) return;

    const data = OversData.teamData.sort((a, b) => b.currentInnings - a.currentInnings);

    // Group teams in pairs and sort by batting order
    const pairs: TeamData[][] = [];
    for (let i = 0; i < data.length; i += 2) {
      pairs.push([data[i], data[i + 1]]);
    }
    pairs.forEach((pair) => {
      pair.sort((a, b) => a.teamBattingOrder - b.teamBattingOrder);
    });

    const sortedArray = pairs.flat();

    let currentTeam = {}
    OversData.teamData?.map(
      (team) => {
        if (team.teamStatus === 1 && OversData.commentaryDetails.currentInnings === team.currentInnings) currentTeam['battingTeam'] = team
        else if (team.teamStatus === 2 && OversData.commentaryDetails.currentInnings === team.currentInnings) currentTeam['bowlingTeam'] = team
      }
    );
    const formattedOver = {};

    OversData.overDetails.forEach(over => {
      // Ensure the teamId exists in the formattedOver
      if (!formattedOver[over.teamId]) {
        formattedOver[over.teamId] = {};
      }

      // Ensure the currentInnings exists under the teamId
      if (!formattedOver[over.teamId][over.currentInnings]) {
        formattedOver[over.teamId][over.currentInnings] = [];
      }

      // Add balls to the over
      const ballsForOver = OversData.ballsData.filter(ball => (ball.overId === over.overId) && (ball.ballType !== BALL_TYPE_OVER_COMPLETE));

      // Sort balls by commentaryBallByBallId in descending order
      ballsForOver.sort((a, b) => b.commentaryBallByBallId - a.commentaryBallByBallId);

      // Attach balls to the over object
      over.balls = ballsForOver;

      // Push the over details into the innings array
      formattedOver[over.teamId][over.currentInnings].push(over);
    });

    // Sort the overs within each innings by overId in descending order
    Object.keys(formattedOver).forEach(teamId => {
      Object.keys(formattedOver[teamId]).forEach(innings => {
        formattedOver[teamId][innings].sort((a, b) => b.overId - a.overId);
      });
    });


    setTeamsData(sortedArray);
    setCurrentBowlingTeam(currentTeam.bowlingTeam);
    setCurrentBattingTeam(currentTeam.battingTeam);
    setOversDetails(formattedOver);
    setPlayers(OversData.playerData)
  }, [OversData]);

  if (loading) {
    return <OversSkeleton />;
  }

  if (!oversDetails) {
    return (
      <div className="card rounded-lg shadow p-0">
        <div className="score-card-inner flex-grow-1 px-5 py-5 text-center">
          <strong>Match has not started yet</strong>
        </div>
      </div>
    );
  }
  const isTwoTeamBatted = teamsData?.every((team) => team.crr !== null);
  return (
    <div className="grid grid-cols-1 gap-4">
      {teamsData
        ?.sort((a, b) => a.status - b.status) // Sort teams by innings
        .map((teamData, index) => {
          const teamOvers = oversDetails?.[teamData.teamId]?.[teamData.currentInnings]; // Fetch overs for the current team and innings
          if (
            teamData.currentInnings <= OversData?.commentaryDetails?.currentInnings &&
            teamOvers?.length > 0 // Ensure overs exist for the team and innings
          ) {
            return (
              <Accordion key={teamData?.commentaryTeamId} defaultExpanded={isTwoTeamBatted ? index === 0 : index === 1}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  className="batsmen-header h-0"
                >
                  <div className="flex items-center space-x-2">
                    {/* <Image
                      width={24}
                      height={24}
                      className="rounded"
                      src={TeamName(teamData?.teamId)?.image || "/assets/images/flag.png"}
                      // src={TeamName(teamData?.teamId)?.image || null}
                      alt="Team Image"
                    /> */}
                    <div className="w-10 h-10">
                      <AppImage
                        src={TeamName(teamData?.teamId)?.nimage || "/assets/images/flag.png"}
                        width={40}
                        height={40}
                        alt="Team 1"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h5 className="text-sm font-medium">
                      {TeamName(teamData.teamId)?.teamName || "Team Name"}
                    </h5>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <section key={teamData.teamId} className="w-full">
                    <div className="card rounded-lg shadow">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          {/* <thead>
                          <tr>
                            <th className="text-left p-3 bg-gray-50 rounded-t-lg">
                              <div className="flex items-center space-x-2">
                                <Image
                                  width={24}
                                  height={24}
                                  className="rounded"
                                  src={TeamName(teamData?.teamId)?.image || "/assets/images/flag.png"}
                                  alt="Team Image"
                                />
                                <h5 className="text-sm font-medium">
                                  {TeamName(teamData.teamId)?.teamName || "Team Name"}
                                </h5>
                              </div>
                            </th>
                          </tr>
                        </thead> */}
                          <tbody>
                            {teamOvers.map((over, index) => {
                              return (
                                <tr key={index} className="border-b last:border-b-0">
                                  <td className="p-2 bg-white">
                                    <div className="space-y-3">
                                      {/* Over and Bowler Information */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          {isShowClient && (
                                            // <PlayerImage
                                            //   width={35}
                                            //   playerImage={PlayerImages(over.bowlerId)}
                                            //   jerseyImage={
                                            //     teamJersay(teamData.teamId) || "/images/SampleJersy.png"
                                            //   }
                                            // />
                                            <AppImage
                                              src={PlayerImages(over.bowlerId)}
                                              alt="Player"
                                              width={32}
                                              height={30}
                                            />
                                          )}
                                          <div>
                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 rounded mr-2">
                                              Ov: {over.over + 1}
                                            </span>
                                            {isShowClient && (
                                              <span className="text-sm">
                                                {findPlayer(over.bowlerId) || "Bowler Name"}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-sm font-medium">
                                          {over.totalRun} runs |{" "}
                                          {over.totalWicket <= 0 ? 0 : over.totalWicket} wicket{" "}
                                          <span className="ml-2">
                                            [{over.teamScore ?? findPreviousScore(teamOvers, index)}]
                                          </span>
                                        </div>
                                      </div>

                                      {/* Balls Details */}
                                      <div className="flex flex-wrap gap-2">
                                        {over.balls
                                          ?.sort((a, b) => parseFloat(a.commentaryBallByBallId) - parseFloat(b.commentaryBallByBallId))
                                          ?.filter((ball) => ball.ballType != 10) // Exclude specific ball types
                                          .map((ball, ballIndex) => {
                                            const previousBall = over?.balls?.sort((a, b) => a.overCount - b.overCount)[ballIndex - 1];
                                            const nextball = over?.balls?.sort((a, b) => a.overCount - b.overCount)[ballIndex + 1];
                                            if (nextball && nextball.ballIsWicket && nextball.overCount === ball.overCount) {
                                              return null;
                                            }
                                            const runClass = getRunClass(
                                              ball.ballType,
                                              ball.ballExtraRun,
                                              ball.ballIsBoundry,
                                              ball.ballRun,
                                              ball.ballIsWicket
                                            );

                                            let displayText = "";
                                            let textColor = "";
                                            let backgroundColor = "";
                                            if(over.balls?.length == 1) {
                                              displayText = "Yet to Ball"
                                            } else if (Object.keys(OTHER_BALLS).includes(String(ball.ballType))) {
                                              displayText = `${ball.ballRun > 0 ? ball.ballRun + " " : ""}${OTHER_BALLS[ball.ballType]}`;
                                              backgroundColor = 'bg-[#ffc107]';
                                              textColor = 'text-black';
                                            } else if (ball.ballIsWicket) {
                                              if (
                                                previousBall &&
                                                previousBall.overCount === ball.overCount
                                              ) {
                                                displayText = `${previousBall.ballRun > 0 ? previousBall.ballRun + " " : ""}${OTHER_BALLS[previousBall.ballType] || 0} | W`;
                                                backgroundColor = 'bg-red-500';
                                                textColor = 'text-white';
                                              } else {
                                                displayText = "W";
                                                backgroundColor = "bg-red-500";
                                                textColor = "text-white";
                                              }
                                            } else if (ball.ballType === 9) {
                                              displayText = "RH";
                                            } else if(ball.ballType == 10) {
                                              displayText = "";
                                            } else {
                                              displayText = ball.ballRun.toString();
                                              backgroundColor = (ball.ballRun == '4' || ball.ballRun == '6') && 'bg-[#32cf8a]';
                                              textColor = (ball.ballRun == '4' || ball.ballRun == '6') && 'text-white';
                                            }

                                            return (
                                              <span
                                                key={ballIndex}
                                                // className={cn(
                                                //   "inline-block px-2 py-1 text-sm rounded shadow-sm",
                                                //   runClass
                                                // )}
                                                className={
                                                  `inline-block px-2 py-1 text-sm rounded border shadow-sm ${backgroundColor} ${textColor}`
                                                }
                                              >
                                                {displayText}
                                              </span>
                                            );
                                          })}
                                        {/* If no balls, show a placeholder */}
                                        {over.balls?.length === 0 && <span className="text-sm">No balls bowled</span>}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                </AccordionDetails>
              </Accordion>
            );
          }
          return null;
        })}
    </div>
  );

};