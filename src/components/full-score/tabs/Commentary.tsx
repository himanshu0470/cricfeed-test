// @ts-nocheck
// components/Commentary/CommentaryDetails.tsx
'use client';

import React, { useEffect, useState } from "react";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import BallDetails from "../shared/BallDetails";
import PlayerImage from "../shared/PlayerImage";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Avatar,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Ball, CommentaryTabProps, CommentaryPlayer, CommentaryTeam } from "@/types/full-score/commentary";
import AppImage from "@/constants/AppImage";

export default function CommentaryTab({ commentaryOverData, isShowClient, /* imgBaseUrl */ }: CommentaryTabProps) {
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const tokenVal = localStorage.getItem("accessToken");
    setToken(tokenVal || "");
  }, []);

  const getPlayerImage = (sqt: CommentaryPlayer[], pid: number): string | undefined => {
    const player = sqt?.find(player => player.commentaryPlayerId === pid);
    // return `${imgBaseUrl}${player?.playerimage}`;
    return player?.playerimage;
  };

  const getPlayerName = (sqt: CommentaryPlayer[], playerId: number): string | undefined => {
    if (sqt && playerId) {
      const playerName = sqt?.find((val) => val.commentaryPlayerId === playerId);
      return playerName?.playerName;
    }
  };

  const TeamName = (teamId: number): CommentaryTeam | undefined => {
    return commentaryOverData?.teamsData?.find((val: { teamId: number; }) => val?.teamId !== teamId);
  };

  const filteredTeams = commentaryOverData?.td
    ?.filter((team) => {
      // Only show teams that have overs or balls recorded
      const hasOversOrBalls = commentaryOverData?.ov.some(
        (over) => over.teamId === team.teamId && over.ball?.some((ball) => ball.ballType !== 0)
      );
      return hasOversOrBalls;
    })
    .sort((a, b) => {
      // Sort teams by their batting order (highest order first)
      return (a.teamBattingOrder || 0) - (b.teamBattingOrder || 0);
    });

  if (!commentaryOverData?.td.length) {
    return (
      <div className="card shadow-md p-0">
        <div className="score-card-inner flex-grow-1 px-20 py-20 text-center">
          <strong>Match has not started yet</strong>
        </div>
      </div>
    );
  }

  return (

    <div>
      {filteredTeams?.map((data, index) => {
        const sqt1 = ((data.commentaryTeamId === commentaryOverData?.t1id || data.commentaryTeamId === commentaryOverData?.t3id)
          ? commentaryOverData?.sqt1
          : commentaryOverData?.sqt2);
        const sqt2 = (sqt1 === commentaryOverData?.sqt1 ? commentaryOverData?.sqt2 : commentaryOverData?.sqt1);
        return (
          <Accordion key={index} className="my-2 rounded-md" defaultExpanded={index === 0 ? true : false}>
            {/* <div className="accordion-item" key={index}> */}
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              className="batsmen-header h-0"
            >
              <div className="font-bold text-sm flex items-center">
                <div className="w-10 h-10 rounded-full">
                  {/* <Image
                    src={TeamName(data?.teamId)?.image || "/assets/images/flag.png"}
                    alt="Team Logo"
                    width={10}
                    height={10}
                    priority
                  /> */}
                  <AppImage
                    src={TeamName(data?.teamId)?.nimage || "/assets/images/flag.png"}
                    alt="Team 1"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="ml-2">{TeamName(data?.teamId)?.teamName || "Team Name"}</span>
              </div>
            </AccordionSummary>
            {/* <h5 className="accordion-header flex items-center gap-4 p-4 bg-gray-200 rounded-t-lg">
                <div className="flag-avatar">
                  <Image
                    src={TeamName(data?.teamId)?.image || "/assets/images/flag.png"}
                    alt="Team Logo"
                    width={40}
                    height={40}
                    priority
                  />
                </div>
                <span className="team-name text-lg font-bold text-gray-700">
                  {TeamName(data?.teamId)?.teamName || "Team Name"}
                </span>
              </h5> */}
            <AccordionDetails>
              <div id={`bd_innings-${index}`}>
                <div className="accordion-body">
                  <section>
                    <div className="widget widget-rankings">
                      {commentaryOverData?.ov
                        .filter((over) => over.teamId === data.teamId && over.currentInnings === data.currentInnings)
                        ?.sort((a, b) => b.overId - a.overId)
                        ?.map((data2, index2) => {
                          const findPreviousScore = (currentIndex) => {
                            const overs = commentaryOverData?.ov.filter(
                              (a) => a.teamId === data.teamId && a.currentInnings === data.currentInnings
                            );
                            if (!overs || currentIndex < 0) return "NaN";

                            for (let i = currentIndex + 1; i < overs.length; i++) {
                              const prevOver = overs[i];
                              if (prevOver?.teamScore !== null) {
                                return prevOver.teamScore;
                              }
                            }
                            return "NaN";
                          };
                          
                          return (
                            <div key={index2} className="over-section">
                              <div className="over-header bg-gray-100 shadow px-2 flex justify-between items-center">
                                {/* Left Section: Over Number, Bowler Image, Bowler Name */}
                                <div className="flex items-center gap-4">
                                  <span className="over-number text-lg font-bold text-gray-700">
                                    Over {data2.over + 1}
                                  </span>
                                  {isShowClient && (
                                    // <PlayerImage
                                    //   width="30px"
                                    //   playerImage={getPlayerImage([...sqt1, ...sqt2], data2.bowlerId)}
                                    //   jerseyImage={data.jersey}
                                    // />
                                     <AppImage
                                      src={getPlayerImage([...sqt1, ...sqt2], data2.bowlerId)}
                                      alt="Player"
                                      width={32}
                                      height={30}
                                    />
                                  )}
                                  {isShowClient && (
                                    <span className="bowler-name text-sm uppercase font-semibold">
                                      {getPlayerName([...sqt1, ...sqt2], data2.bowlerId)}
                                    </span>
                                  )}
                                </div>

                                {/* Right Section: Over Summary */}
                                <div className="over-summary text-right p">
                                  <span className="text-sm font-medium text-gray-600">
                                    {data2.totalRun} runs | {data2.totalWicket} wicket
                                  </span>
                                  <span className="score block text-md font-semibold text-gray-700">
                                    [{data2?.teamScore || findPreviousScore(index2)}]
                                  </span>
                                </div>
                              </div>

                              <div className="ball-by-ball">
                                {data2.ball
                                ?.sort(
                                    (a, b) =>
                                      parseFloat(String(b.commentaryBallByBallId)) -
                                      parseFloat(String(a.commentaryBallByBallId))
                                  )
                                  ?.filter((ball) => ball.ballType !== 10)
                                  ?.map((ball, ballIndex) => {
                                    const previousBall = data2?.ball
                                      ?.sort((a, b) => parseFloat(b.overCount) - parseFloat(a.overCount))[ballIndex + 1];

                                    const nextBall = data2?.ball
                                      ?.sort((a, b) => parseFloat(b.overCount) - parseFloat(a.overCount))[ballIndex - 1];

                                    if (nextBall?.ballIsWicket && nextBall.overCount === ball.overCount) {
                                      return null;
                                    }
                                    return (
                                      ball?.ballType !== 0 ? <BallDetails
                                        key={ballIndex}
                                        ball={ball}
                                        previousBall={previousBall}
                                        bowler={getPlayerName([...sqt1, ...sqt2], data2.bowlerId) || ""}
                                        batsman={getPlayerName([...sqt1, ...sqt2], ball.batStrikeId) || ""}
                                        isShowClient={isShowClient}
                                        token={token}
                                        marketData={commentaryOverData?.marketData}
                                        team1Id={commentaryOverData?.team1Id}
                                        team2Id={commentaryOverData?.team2Id}
                                        router={router}
                                      /> : null
                                    );
                                  })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </section>
                </div>
              </div>
            </AccordionDetails>
            {/* </div> */}
          </Accordion>
        );
      })}
    </div>
  );
}
