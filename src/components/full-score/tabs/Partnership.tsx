// components/Partnership/PartnershipDetails.tsx
'use client';

import React from 'react';
// import Image from 'next/image';
import { PartnershipTabProps } from '@/types/full-score/partnership';
import PlayerImage from '../shared/PlayerImage';
import PartnershipTabSkeleton from '@/components/skeleton/Partnership';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Avatar,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AppImage from '@/constants/AppImage';


export default function PartnershipTab({ partnershipData, loading = false, /* imgBaseUrl */ }: PartnershipTabProps) {
  if (loading) {
    return <PartnershipTabSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {partnershipData.sort((a, b) => a?.teamStatus - b?.teamStatus)?.map((currentTeam, index) => (
        <Accordion key={currentTeam?.teamId} defaultExpanded={index === 0 ? true : false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            className="batsmen-header h-0"
          >
            <h5
              className="flex items-center gap-2 font-bold text-sm"
              data-bs-target={`#team-${index}`}
              aria-expanded="true"
            >
              <div className="h-10 w-10">
                <figure>
                  {/* <Image
                    src={currentTeam?.image || "/assets/images/flag.png"}
                    alt={currentTeam.teamName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  /> */}
                  <AppImage
                    src={currentTeam?.nimage || "/assets/images/flag.png"}
                    width={40}
                    height={40}
                    alt="Team 1"
                    className="rounded-full object-cover"
                  />
                </figure>
              </div>
              {currentTeam?.teamName}
            </h5>
          </AccordionSummary>
          <div
            key={`team-${currentTeam.teamId}-${index}`}
            className="col-span-1 bg-gray-100 rounded-lg shadow"
          >
            {/* <h5
            className="flex items-center gap-2 font-bold text-lg mb-4"
            data-bs-target={`#team-${index}`}
            aria-expanded="true"
          >
            <div className="flag-avatar">
              <figure>
                <Image
                  src={currentTeam?.image || "/assets/images/flag.png"}
                  alt={currentTeam.teamName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </figure>
            </div>
            {currentTeam?.teamName}
          </h5> */}
            <AccordionDetails>
              <div id={`team-${index}`}>
                {currentTeam?.par
                  ?.filter(currentPlayer =>
                    currentPlayer?.teamId === currentTeam?.teamId &&
                    currentPlayer?.currentInnings === currentTeam?.currentInnings &&
                    (currentPlayer.batter1Name || currentPlayer.batter2Name)
                  )
                  ?.map((currentPlayer, playerIndex) => (
                    <div
                      key={`partnership-${playerIndex}`}
                      className="flex items-center bg-white px-2 py-1 my-2 shadow-md"
                    >
                      <div className='mr-4 font-semibold'>{playerIndex + 1}</div>
                      {/* First Batter */}
                      <div className="w-2/5 flex items-center gap-3">
                        {/* <PlayerImage
                          width="40px"
                          playerImage={currentPlayer?.player1image}
                          jerseyImage={currentTeam?.jersey}
                          className="player-left"
                        /> */}
                        {/* <Image
                          src={`${imgBaseUrl}${currentPlayer?.player1image}`}
                          alt="Player"
                          width={32}
                          height={30}
                        /> */}
                        <AppImage
                          src={currentPlayer?.player1image}
                          alt="Player"
                          width={32}
                          height={30}
                        />
                        <div className="text-sm font-medium uppercase">
                          {currentPlayer.batter1Name}
                          <div className='flex justify-center'>
                            <span className='text-xs text-black font-semibold'>{currentPlayer.batter1Runs} </span>
                            <span className='text-xs text-gray-600 font-medium'>({currentPlayer.batter1Balls})</span>
                          </div>
                        </div>
                      </div>

                      {/* Partnership Score */}
                      <div className="w-1/5 text-center">
                        <span className="text-sm font-semibold">
                          {`${currentPlayer.totalRuns} `}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({currentPlayer.totalBalls})
                        </span>
                        <div>
                          <span className='text-xs text-gray-600 font-medium'>4's : </span>
                          <span className="text-xs text-gray-600 font-medium mr-4">{`${currentPlayer.totalFour}  `}</span>
                          <span className="text-xs text-gray-600 font-medium">6's : </span>
                          <span className="text-xs text-gray-600 font-medium">{currentPlayer.totalSix}</span>
                        </div>
                      </div>

                      {/* Second Batter */}
                      <div className="w-2/5 flex items-center gap-3 flex-row-reverse">
                        {/* <PlayerImage
                          width="40px"
                          playerImage={currentPlayer?.player2image}
                          jerseyImage={currentTeam?.jersey}
                          className="player-right"
                        /> */}
                        {/* <Image
                          src={`${imgBaseUrl}${currentPlayer?.player2image}`}
                          alt="Player"
                          width={32}
                          height={30}
                        /> */}
                        <AppImage
                          src={currentPlayer?.player2image}
                          alt="Player"
                          width={32}
                          height={30}
                        />
                        <span className="text-sm font-medium uppercase">
                          {currentPlayer.batter2Name}
                          <div className='flex justify-center'>
                            <span className='text-xs text-black font-semibold'>{currentPlayer.batter2Runs} </span>
                            <span className='text-xs text-gray-600 font-medium'>({currentPlayer.batter2Balls})</span>
                          </div>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </AccordionDetails>
          </div>
        </Accordion>
      ))}
    </div>
  );
}