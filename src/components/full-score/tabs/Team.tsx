// components/LiveTeams/LiveTeams.tsx
'use client';

import React, { useEffect, useState } from "react";
// import Image from "next/image";
import TeamSkeleton from "@/components/skeleton/full-score/teams";
import PlayerImage from "../shared/PlayerImage";
import { LiveTeamsProps, Player } from "@/types/full-score/teams";
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
import { isEmpty } from "lodash";

export default function TeamTab({ teamData, loading, /* imgBaseUrl */ }: LiveTeamsProps) {
  const [team1Players, setTeam1Players] = useState<Player[]>([]);
  const [team2Players, setTeam2Players] = useState<Player[]>([]);

  useEffect(() => {
    if (teamData?.sqt1) {
      setTeam1Players(teamData.sqt1.sort((a, b) => a.ord - b.ord));
    }
    if (teamData?.sqt2) {
      setTeam2Players(teamData.sqt2.sort((a, b) => a.ord - b.ord));
    }
  }, [teamData]);

  if (loading) {
    return <TeamSkeleton />;
  }
  // console.log("--------------------------------------------",teamData)
  if (!teamData || 
    teamData === null || 
    isEmpty(teamData) || 
    !teamData.te1n || 
    !teamData.te2n ||
    (!teamData.sqt1 && !teamData.sqt2)) {
  return (
    <div className="card shadow-md p-0">
      <div className="score-card-inner flex-grow-1 px-20 py-20 text-center">
        <strong>No teams data available</strong>
      </div>
    </div>
  );
}
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        {/* Team 1 */}
        {teamData.te1n && teamData.sqt1 && (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            className="batsmen-header h-0"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <AppImage
                  src={teamData?.nt1img || "/assets/images/flag.png"}
                  width={40}
                  height={40}
                  alt="Team 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <h5 className="font-bold text-sm">{teamData.te1n}</h5>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="rounded-lg">
              <div
                className="cursor-pointer"
                data-toggle="collapse"
                data-target="#ind_innings"
              >
                {/* <div className="flex items-center space-x-3 p-4 ">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={teamData?.t1img || "/assets/images/flag.png"}
                  alt="Team 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <h5 className="font-semibold text-lg">{teamData.te1n}</h5>
            </div> */}
              </div>

              <div id="ind_innings">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                    {team1Players
                      ?.filter((item) =>
                        item?.currentInnings == teamData?.es?.currentInnings &&
                        item?.isInPlayingEleven
                      )
                      ?.map((item, index) => (
                        < div key={index} className="bg-white rounded-lg shadow-sm" >
                          <div className="px-2 py-1">
                            <div className="flex items-center space-x-3">
                              {/* <PlayerImage
                                playerImage={item?.playerimage}
                                jerseyImage={teamData?.t1jr}
                              /> */}
                              {/* <Image
                                src={`${imgBaseUrl}${item?.jerseyPlayerImage}`}
                                alt="Player"
                                width={32}
                                height={30}
                              /> */}
                              <AppImage
                                src={item?.jerseyPlayerImagePath}
                                alt="Player"
                                width={32}
                                height={30}
                              />
                              <div>
                                <div className=" ml-2 font-semibold text-sm truncate">
                                  {item.playerName}
                                </div>
                                <div className=" ml-2 text-gray-600 text-xs">
                                  {item.playerType}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>)}
        {/* Team 2 */}
        {teamData.te2n && teamData.sqt2 && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            className="batsmen-header h-0"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <AppImage
                  src={teamData?.nt2img || "/assets/images/flag.png"}
                  alt="Team 2"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <h5 className="font-bold text-sm">{teamData.te2n}</h5>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="rounded-lg">
              <div
                className="cursor-pointer"
                data-toggle="collapse"
                data-target="#bd_innings"
              >
                {/* <div className="flex items-center space-x-3 p-4 ">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={teamData?.t2img || "/assets/images/flag.png"}
                  alt="Team 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <h5 className="font-semibold text-lg">{teamData.te2n}</h5>
            </div> */}
              </div>

              <div id="bd_innings" >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                    {team2Players
                      ?.filter((item) =>
                        item?.currentInnings == teamData?.es?.currentInnings &&
                        item?.isInPlayingEleven
                      )
                      ?.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm">
                          <div className="p-2">
                            <div className="flex items-center space-x-3">
                              {/* <PlayerImage
                                width="40"
                                playerImage={item?.playerimage}
                                jerseyImage={teamData?.t2jr}
                              /> */}
                              {/* <Image
                                src={`${imgBaseUrl}${item?.jerseyPlayerImage}`}
                                alt="Player"
                                width={32}
                                height={30}
                              /> */}
                              <AppImage
                                src={item?.jerseyPlayerImagePath}
                                alt="Player"
                                width={32}
                                height={30}
                              />
                              <div>
                                <div className=" ml-2 font-semibold text-sm">
                                  {item.playerName}
                                </div>
                                <div className=" ml-2 text-gray-600 text-xs">
                                  {item.playerType}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
              </div>
            </div></AccordionDetails>
        </Accordion>)}
      </div>
    </div>
  );
}