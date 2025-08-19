// utils/scoreProcessing.ts
// @ts-nocheck
import _, { isEmpty } from "lodash";
import { BALL_TYPE_OVER_COMPLETE, BALL_TYPE_PANELTY_RUN, OTHER_BALLS } from '@/constants/fullScoreConst';
import { OverData, Player, ProcessedScoreData, TeamData } from '@/types/full-score/fullScore';
import { FormattedInningsData, FormattedScoreCardData } from '@/types/full-score/scorecard';
import { ModuleData, TeamInfo } from '@/types/matches';
import { CommentaryTeam, CommentaryPlayer, CommentaryOverData, Over, Ball } from '@/types/full-score/commentary';
import { FormattedTeamData, RawTeam } from '@/types/full-score/teams';
import { ChartData, FormattedChartData } from '@/types/full-score/charts';
import { DateTimeLocal } from '@/types/full-score/teamScore';
import moment from 'moment-timezone';
import { getCurrentOver } from "./function";

export const processLiveTabData = (
    commentaryDetails: Record<string, any | null>,
    commentaryPlayers: Record<string, any | null>[],
    commentaryBallByBall: Record<string, any | null>[],
    commentaryTeams: Record<string, any | null>[],
    overData: any,
    liveTabData: any
): ProcessedScoreData => {
    // Process active batsmen
    // const activeBatsmen = commentaryPlayers
    //     ?.filter(player => player.isPlay && !player.isBatterOut && (player.onStrike !== null) && !player.bowlerOver)
    //     ?.map(player => (
    //         {
    //             bati: player?.jerseyPlayerImage,
    //             batn: player.playerName,
    //             os: player.onStrike || false,
    //             trun: player.batRun || 0,
    //             tball: player.batBall || 0,
    //             t4: player.batFour || 0,
    //             t6: player.batSix || 0,
    //             str: player.batSrr || 0,
    //             teamId: player.teamId
    //         })) || [];
    const activeTeamPlayers = commentaryPlayers
    ?.filter(player =>
        player.isPlay &&
        !player.isBatterOut &&
        (player.onStrike !== null)
    );

    const teamId = activeTeamPlayers?.[0]?.teamId; // Get the teamId of the first valid player

    const activeBatsmen = activeTeamPlayers
    ?.filter(player => player.teamId === teamId) // Ensure all players have the same teamId
    ?.map(player => ({
        bati: player?.jerseyPlayerImagePath,
        batn: player.playerName,
        os: player.onStrike || false,
        trun: player.batRun || 0,
        tball: player.batBall || 0,
        t4: player.batFour || 0,
        t6: player.batSix || 0,
        str: player.batSrr || 0,
        teamId: player.teamId
    })) || [];

    // Process active bowlers
    const activeBowlers = commentaryPlayers
        ?.filter(player => player.isPlay && player.bowlerOver)
        ?.map(player => ({
            bli: player?.jerseyPlayerImagePath,
            pn: player.playerName,
            tov: player.bowlerOver || 0,
            mov: player.bowlerMaidenOver || 0,
            trun: player.bowlerRun || 0,
            twik: player.bowlerTotalWicket || 0,
            eco: player.bowlerEconomy || 0
        })) || [];

    // Process current over
    // const currentOverBalls = commentaryBallByBall
    //     ?.filter(ball => {
    //         // Exclude balls where ballType === 1
    //         if (ball.ballType === BALL_TYPE_OVER_COMPLETE) {
    //             return false;
    //         }
    //         // Include only balls from the latest over
    //         const currentOver = Math.floor(Number(ball.overCount));
    //         const latestOver = Math.max(...commentaryBallByBall.map(b => Math.floor(Number(b.overCount))));
    //         return currentOver === latestOver;
    //     })
    //     ?.map(ball => ({
    //         ballType: ball.ballIsWicket
    //             ? 'wicket'
    //             : ball.ballIsBoundry
    //                 ? 'boundary'
    //                 : 'normal',
    //         run: ball.ballRun,
    //         commentaryBallByBallId: ball.commentaryBallByBallId // Include this for sorting
    //     }))
    //     ?.sort((a, b) => b.commentaryBallByBallId - a.commentaryBallByBallId) || []; // Sort by commentaryBallByBallId descending

    const currentOverBalls = getCurrentOver(liveTabData?.cm?.scov, liveTabData?.cbb);

    let t1jr;
    let t2jr;
    commentaryTeams?.map(team => {
        if (team.teamId === commentaryDetails.team1Id) t1jr = team.jersey
        else if (team.teamId === commentaryDetails.team2Id) t2jr = team.jersey
    })

    return {
        commentaryData: {
            cm: {
                scot: overData?.scot || '',
                t1sn: overData?.t1sn || '',
                t2sn: overData?.t2sn || '',
                t3sn: overData?.t3sn || '',
                t4sn: overData?.t4sn || '',
                t1jr: overData?.t1jr || '',
                t2jr: overData?.t2jr || ''
            },
            // cbt: activeBatsmen,
            // cbl: activeBowlers,
            cbt: liveTabData.cbt,
            cbl: liveTabData.cbl,
            currOver: currentOverBalls
        }
    };
};

export const getRunClass = (bty: number, ext: any, isB: any, runs: any, wik: any) => {
    if (bty) {
        if (bty == BALL_TYPE_PANELTY_RUN) return "bg-dark";
        if (Object.keys(OTHER_BALLS).includes(String(bty))) return "bg-warning";
        if (isB) return "bg-success";
        if (wik) return "bg-danger";
        if (bty == 9) return "bg-warning";
        if (runs) return "";
        return "";
    }
};

export const formatCricketData = (data: any): FormattedScoreCardData => {
    // Filter active players and sort by display order
    const getActiveSquad = (players: any[]) =>
        players
            .filter(player => player.isInPlayingEleven)
            .sort((a, b) => a.displayOrder - b.displayOrder);

    // Get batting data for current innings
    const getBattingData = (players: any[], teamId: string, innings: number) =>
        players
            .filter(player =>
                player.teamId === teamId &&
                player.currentInnings === innings &&
                (player.batterOrder || player.isBatterOut)
            )
            .sort((a, b) => (a.batterOrder || 0) - (b.batterOrder || 0));

    // Get bowling data for current innings  
    const getBowlingData = (players: any[], teamId: string, innings: number) =>
        players
            .filter(player =>
                player.teamId === teamId &&
                player.currentInnings === innings &&
                player.bowlerOver &&
                parseFloat(player.bowlerOver) > 0
            )
            .sort((a, b) => (a.bowlerOrder || 0) - (b.bowlerOrder || 0));

    // Extract teams for both innings
    const teams = data.commentaryTeams
        .sort((a: any, b: any) => a.currentInnings - b.currentInnings)
        .map((team: any) => {
            if (team.teamBattingOrder)
                return {
                    teamId: team.teamId,
                    teamName: team.teamName,
                    image: team.image,
                    nimage: team?.nimage,
                    currentInnings: team.currentInnings,
                    commentaryTeamId: team.commentaryTeamId,
                    jersey: team.jersey,
                    teamStatus: team.teamStatus,
                    teamBattingOrder: team.teamBattingOrder
                }
            else return null
        }).filter((a: any) => a);

    // Get current batting and bowling team IDs
    const currentBattingTeam = teams.find(team =>
        team.teamStatus === 1 && team.currentInnings === data.commentaryDetails.currentInnings
    );
    const prevBattingTeam = teams?.find(
        (team) =>
          team.teamStatus === 1 &&
          data.commentaryDetails?.currentInnings !== team?.currentInnings
      );
    const currentBowlingTeam = teams.find(team =>
        team.teamStatus === 2 && team.currentInnings === data.commentaryDetails.currentInnings
    );
    const prevBowlingTeam = teams?.find(
        (team) =>
          team.teamStatus === 2 &&
          data.commentaryDetails?.currentInnings !== team?.currentInnings
      );

    // Get unique team IDs
    const uniqueTeamIds = Array.from(new Set(teams.map(team => team.teamId)));
    const [team1Id, team2Id] = uniqueTeamIds;

    // Split players into squads
    const allPlayers = data.commentaryPlayers;
    // const team1Players = allPlayers.filter((p: any) =>
    //     p.teamId === teams[0]?.teamId &&
    //     p.currentInnings === teams[0]?.currentInnings
    // );
    // const team2Players = allPlayers.filter((p: any) =>
    //     p.teamId === teams[1].teamId &&
    //     p.currentInnings === teams[1].currentInnings
    // );
    
    // Team 1 players for all innings
    const team1AllPlayers = allPlayers.filter((p: any) => p.teamId === team1Id);
    const team1 = teams.find(t => t.teamId === team1Id && t.currentInnings === 1);
    const team3 = teams.find(t => t.teamId === team1Id && t.currentInnings === 2);

    // Team 2 players for all innings
    const team2AllPlayers = allPlayers.filter((p: any) => p.teamId === team2Id);
    const team2 = teams.find(t => t.teamId === team2Id && t.currentInnings === 1);
    const team4 = teams.find(t => t.teamId === team2Id && t.currentInnings === 2);

    // Format innings data
   // Create innings data for all available innings
    const allInningsData = {};
    const availableInnings = Array.from(new Set(teams.map(team => team.currentInnings)));

    availableInnings.forEach(innings => {
        // Find batting and bowling teams for this specific innings
        const battingTeamForInnings = teams.find(team =>
            team.teamStatus === 1 && team.currentInnings === innings
        );
        const bowlingTeamForInnings = teams.find(team =>
            team.teamStatus === 2 && team.currentInnings === innings
        );

        // Create innings data using your existing logic
        const inningsDataForThisInnings = {
            bat1: getBattingData(allPlayers.filter(
                        item => (item.onStrike !== null || item.isBatterOut === true) && item.batterOrder !== null
                    ), battingTeamForInnings?.teamId || '', innings),
            bat2: getBattingData(allPlayers.filter(
                        item => (item.onStrike !== null || item.isBatterOut === true) && item.batterOrder !== null
                    ), bowlingTeamForInnings?.teamId || '', innings),
            bow1: getBowlingData(allPlayers.filter(item => item.bowlerOrder !== null), battingTeamForInnings?.teamId || '', innings),
            bow2: getBowlingData(allPlayers.filter(item => item.bowlerOrder !== null), bowlingTeamForInnings?.teamId || '', innings),
            fow1: data.commentaryWicket
                ?.filter((w: any) => w.teamId === battingTeamForInnings?.teamId && w.currentInnings === innings)
                .map((w: any) => ({
                    teamScore: w.teamScore,
                    wicketCount: w.wicketCount,
                    batterName: w.batterName
                })) || [],
            fow2: data.commentaryWicket
                ?.filter((w: any) => w.teamId === bowlingTeamForInnings?.teamId && w.currentInnings === innings)
                .map((w: any) => ({
                    teamScore: w.teamScore,
                    wicketCount: w.wicketCount,
                    batterName: w.batterName
                })) || []
        };

        allInningsData[`cci${innings}`] = inningsDataForThisInnings;
    });
    return {
        td: teams,
        sqt1: getActiveSquad(team1AllPlayers),
        sqt2: getActiveSquad(team2AllPlayers),
        team1Id: teams[0]?.teamId,
        team2Id: teams[1]?.teamId,
        t1jr: teams[0]?.jersey || '',
        t2jr: teams[1]?.jersey || '',
        baid: currentBattingTeam?.teamId || '',
        boid: currentBowlingTeam?.teamId || '',
        prevBaid: prevBattingTeam?.teamId,
        prevBoid: prevBowlingTeam?.teamId,
        t1id: teams[0]?.commentaryTeamId,
        t2id: teams[1]?.commentaryTeamId,
        t3id: teams[2]?.commentaryTeamId,
        t4id: teams[3]?.commentaryTeamId,
        cci: allInningsData,
        // {
        //     [`cci${data.commentaryDetails.currentInnings}`]: inningsData
        // },
        es: {
            currentInnings: data.commentaryDetails.currentInnings
        },
         allTeamsData: {
            teams,
            currentBattingTeam,
            currentBowlingTeam,
            prevBattingTeam,
            prevBowlingTeam,
            team1AllPlayers,
            team2AllPlayers,
            team1,
            team2,
            team3,
            team4,
        }
    };

};

export const getCommentaryTabRunClass = (
    ballType: number,
    extraRun: number,
    isBoundary: boolean,
    runs: number,
    isWicket: boolean
): string => {
    if (isWicket) return 'wicket';
    if (isBoundary && runs === 4) return 'four';
    if (isBoundary && runs === 6) return 'six';
    if (ballType === 2) return 'wide';
    if (ballType === 3) return 'no-ball';
    if (ballType === 4) return 'bye';
    if (ballType === 5) return 'leg-bye';
    return 'normal';
};

export const getBallResultClass = (
    ballType: number,
    extraRun: number,
    isBoundary: boolean,
    runs: number,
    isWicket: boolean
): string => {
    const ballClass = getCommentaryTabRunClass(ballType, extraRun, isBoundary, runs, isWicket);

    switch (ballClass) {
        case 'wicket':
            return 'bg-red-500 text-white px-2 py-1 rounded'; // Red for wicket
        case 'four':
            return 'bg-[#32cf8a] text-white px-2 py-1 rounded'; // Green for boundary (4 runs)
        case 'six':
            return 'bg-[#32cf8a] text-white px-2 py-1 rounded'; // Green for boundary (6 runs)
        case 'wide':
            return 'bg-[#ffc107] text-black px-2 py-1 rounded'; // Yellow for wide
        case 'no-ball':
            return 'bg-[#ffc107] text-black px-2 py-1 rounded'; // Yellow for no-ball
        case 'bye':
            return 'bg-[#ffc107] text-black px-2 py-1 rounded'; // Yellow for bye
        case 'leg-bye':
            return 'bg-[#ffc107] text-black px-2 py-1 rounded'; // Yellow for leg-bye
        default:
            return 'bg-white text-slate-300 px-2 py-1 rounded'; // Default for normal deliveries
    }
};

export const getCommentaryTabRun = (
    ballType: number,
    isBoundary: boolean,
    runs: number,
    isWicket: boolean
): string => {
    if (isWicket) return 'WICKET!';
    if (isBoundary && runs === 4) return 'FOUR!';
    if (isBoundary && runs === 6) return 'SIX!';
    if (ballType === 2) return 'Wide ball';
    if (ballType === 3) return 'No ball';
    if (ballType === 4) return 'Bye';
    if (ballType === 5) return 'Leg bye';
    return `${runs} run${runs !== 1 ? 's' : ''}`;
};


export const convertDateUTCToLocal = (UTCDate: any, page: string, format: string | undefined) => {
    if (UTCDate) {
        if (page === 'index') {
            return moment(UTCDate).local().format("DD/MM/YY, h:mm:ss a");
        }
        if (format) return moment(UTCDate).local().format(format);
        return moment(UTCDate).local().format("YYYY-MM-DDTHH:mm:ss");
    }
    return "";
}

export const formatCommentaryData = (data: any) => {
    const { commentaryTeams, commentaryPlayers, commentaryOvers, commentaryBallByBall, marketOddsBallByBall } = data;

    // Format teams data
    const teamsData = commentaryTeams
        .filter(team => team.teamBattingOrder !== null)
        .map(team => ({
            teamId: team.teamId,
            teamName: team.teamName,
            image: team.image || "/assets/images/flag.png",
            nimage: team?.nimage,
            jersey: team.jersey,
            commentaryTeamId: team.commentaryTeamId,
            teamBattingOrder: team.teamBattingOrder,
            currentInnings: team.currentInnings,
            status: team.teamStatus,
            order: team.teamBattingOrder
        }));

    // Get team IDs
    const team1Id = teamsData.find(team => [1, 3].includes(team.teamBattingOrder))?.teamId;
    const team2Id = teamsData.find(team => [2, 4].includes(team.teamBattingOrder))?.teamId;

    // Format overs with balls
    const formattedOvers = commentaryOvers.map(over => {
        // Get balls for this over
        const overBalls = commentaryBallByBall
            .filter(ball => ball.overId === over.overId)
            .map(ball => ({
                commentaryBallByBallId: ball.commentaryBallByBallId,
                ballType: ball.ballType,
                ballRun: ball.ballRun || 0,
                ballIsBoundry: ball.ballIsBoundry || false,
                ballIsWicket: ball.ballIsWicket || false,
                overCount: ball.overCount,
                ballExtraRun: ball.ballExtraRun || 0,
                createdDate: ball.createdDate,
                batStrikeId: ball.batStrikeId
            }))
            .sort((a, b) => {
                // Sort by over count in descending order
                const overA = parseFloat(a.overCount);
                const overB = parseFloat(b.overCount);
                return overB - overA;
            });

        return {
            over: over.over,
            totalRun: over.totalRun || 0,
            totalWicket: over.totalWicket || 0,
            teamScore: over.teamScore || "0/0",
            bowlerId: over.bowlerId,
            teamId: over.teamId,
            currentInnings: over.currentInnings,
            ball: overBalls
        };
    });

    return {
        td: teamsData,
        t1id: team1Id,
        t3id: team1Id,
        team1Id,
        team2Id,
        sqt1: commentaryPlayers
            .filter(p => p.teamId === team1Id)
            .map(player => ({
                commentaryPlayerId: player.commentaryPlayerId,
                playerName: player.playerName || "",
                playerimage: player?.jerseyPlayerImagePath || ""
            })),
        sqt2: commentaryPlayers
            .filter(p => p.teamId === team2Id)
            .map(player => ({
                commentaryPlayerId: player.commentaryPlayerId,
                playerName: player.playerName || "",
                playerimage: player?.jerseyPlayerImagePath || ""
            })),
        teamsData,
        ov: formattedOvers
            .filter(over => over.ball && over.ball.length > 0)  // Only include overs with balls
            .sort((a, b) => b.over - a.over), // Sort overs in descending order
        marketData: marketOddsBallByBall || [],
    };
};

export const formatTeamData = (commentaryDetails: any, teams: RawTeam[], players: CommentaryPlayer[]): FormattedTeamData => {
    // Get unique team IDs (should be 2)
    const uniqueTeams = Array.from(new Set(teams.map(team => team.teamId)));

    // Get first innings teams
    const firstInningsTeams = teams.filter(team => team.currentInnings === 1);

    // Determine team1 and team2 based on batting order in first innings
    // const team1 = firstInningsTeams.find(team => team.teamBattingOrder === 1);
    // const team2 = firstInningsTeams.find(team => team.teamBattingOrder === 2);

    const team1 = teams.find(
        (item) => item?.teamId === commentaryDetails?.team1Id && item?.currentInnings === 1
      );
    const team2 = teams.find(
        (item) => item?.teamId === commentaryDetails?.team2Id && item?.currentInnings === 1
      );
    const team3 = teams.find(
        (item) => item?.teamId === commentaryDetails?.team1Id && item?.currentInnings === 2
      );
    const team4 = teams.find(
        (item) => item?.teamId === commentaryDetails?.team2Id && item?.currentInnings === 2
      );

    // if (!team1 || !team2) {
    //     throw new Error('Unable to determine teams from the data');
    // }

    // Get current innings from any team (they should all have same current innings)
    const currentInnings = teams[0]?.currentInnings || 1;

    const sqt1: CommentaryPlayer[] = [];
    const sqt2: CommentaryPlayer[] = [];

    // Process players for both innings
    if (players) {
        players.forEach((player) => {
            if (player?.teamId === commentaryDetails?.team1Id) {
                sqt1.push({
                    ...player,
                    ord: player.displayOrder
                });
            } else if (player?.teamId === commentaryDetails?.team2Id) {
                sqt2.push({
                    ...player,
                    ord: player.displayOrder
                });
            }
        });
    }

    // Sort players by display order
    sqt1.sort((a, b) => a.displayOrder - b.displayOrder);
    sqt2.sort((a, b) => a.displayOrder - b.displayOrder);

    // Filter and sort players for each team
    // const team1Players = players
    //     .filter(player => player.teamId === team1.teamId)
    //     .sort((a, b) => a.displayOrder - b.displayOrder);

    // const team2Players = players
    //     .filter(player => player.teamId === team2.teamId)
    //     .sort((a, b) => a.displayOrder - b.displayOrder);

    return {
        // Team 1 players
        // sqt1: (team1Players || team3Players)
        //     .sort((a, b) => a.displayOrder - b.displayOrder)
        //     .map(player => ({
        //         ...player,
        //         ord: player.displayOrder
        //     })),
        // sqt2: (team2Players || team4Players)
        //     .sort((a, b) => a.displayOrder - b.displayOrder)
        //     .map(player => ({
        //         ...player,
        //         ord: player.displayOrder
        //     })),
        sqt1: sqt1,
        sqt2: sqt2,

        // Team images and names
        t1img: team1?.image,
        t2img: team2?.image,
        nt1img: team1?.nimage,
        nt2img: team2?.nimage,
        t1jr: team1?.jersey,
        t2jr: team2?.jersey,
        te1n: team1?.teamName,
        te2n: team2?.teamName,

        // Current innings info
        es: {
            currentInnings
        }
    };
};

// Helper function to validate team data
export const validateTeamData = (teams: RawTeam[]): boolean => {
    // Get unique team IDs
    const uniqueTeamIds = new Set(teams.map(team => team.teamId));

    // Should only have 2 unique teams
    if (uniqueTeamIds.size !== 2) {
        console.error('Invalid number of unique teams:', uniqueTeamIds.size);
        return false;
    }

    // Check if we have teams for both innings
    const innings1Teams = teams.filter(team => team.currentInnings === 1);
    const innings2Teams = teams.filter(team => team.currentInnings === 2);

    if (innings1Teams.length !== 2 || innings2Teams.length !== 2) {
        console.error('Missing teams for one or more innings');
        return false;
    }

    return true;
};

export const formatPartnershipTabData = (
    commentaryTeams: any[],
    commentaryPartnership: any[]
): TeamData[] => {
    // Filter teams to include only those with at least one partnership
    const teamData: TeamData[] = commentaryTeams
        .map((team) => {
            const relatedPartnerships = commentaryPartnership.filter(
                (part) =>
                    part.teamId === team.teamId &&
                    part.currentInnings === team.currentInnings
            );
            if (relatedPartnerships.length === 0) {
                return null; // Exclude teams with no partnerships
            }
            return {
                teamId: team.teamId,
                commentaryTeamId: team.commentaryTeamId,
                teamName: team.teamName,
                image: team.image,
                nimage: team?.nimage,
                jersey: team.jersey,
                teamStatus: team.teamStatus,
                currentInnings: team.currentInnings,
                par: relatedPartnerships.map((part) => ({
                    batter1Balls: part.batter1Balls,
                    batter1Runs: part.batter1Runs,
                    batter2Balls: part.batter2Balls,
                    batter2Runs: part.batter2Runs,
                    totalFour: part.totalFour,
                    totalSix: part.totalSix,
                    teamId: part.teamId,
                    commentaryTeamId: part.commentaryTeamId,
                    currentInnings: part.currentInnings,
                    batter1Name: part.batter1Name,
                    batter2Name: part.batter2Name,
                    totalRuns: part.totalRuns || 0,
                    totalBalls: part.totalBalls || 0,
                    player1image: part?.player1jerseyandimagepath,
                    player2image: part?.player2jerseyandimagepath,
                })),
            };
        })
        ?.filter((team) => team !== null) // Remove null values
        teamData.forEach((team) => {
            team.par = Array.from(
                team.par.reduce((map, item) => {
                    const key = `${item.teamId}-${item.currentInnings}-${item.batter1Name.trim().toLowerCase()}-${item.batter2Name.trim().toLowerCase()}`;
                    // Always set the latest item for the key
                    map.set(key, item);
                    return map;
                }, new Map<string, Partnership>()).values()
            );
        });
    return teamData;
};

export const formatChartData = (data: ChartData): FormattedChartData => {
    if (!data?.summery || !data?.oversData?.length) {
        return {
            team1Data: [],
            team2Data: [],
            team3Data: [],
            team4Data: [],
            team1Color: '#000000',
            team2Color: '#000000'
        };
    }

    // Sort and filter data for each team and innings
    const team1Data = data.oversData
        .sort((a, b) => a.overId - b.overId)
        .filter(over =>
            over.teamId === data.summery.team1Id &&
            over.currentInnings === data.summery.currentInnings
        );

    const team2Data = data.oversData
        .sort((a, b) => a.overId - b.overId)
        .filter(over =>
            over.teamId === data.summery.team2Id &&
            over.currentInnings === data.summery.currentInnings
        );

    const team3Data = data.oversData
        .sort((a, b) => a.overId - b.overId)
        .filter(over =>
            over.teamId === data.summery.team1Id &&
            over.currentInnings !== data.summery.currentInnings
        );

    const team4Data = data.oversData
        .sort((a, b) => a.overId - b.overId)
        .filter(over =>
            over.teamId === data.summery.team2Id &&
            over.currentInnings !== data.summery.currentInnings
        );

    // Get team colors
    const team1ColorData = data.teamsData.find(item => item.teamId === data.summery.team1Id);
    const team2ColorData = data.teamsData.find(item => item.teamId === data.summery.team2Id);

    return {
        team1Data,
        team2Data,
        team3Data,
        team4Data,
        team1Color: team1ColorData?.teamColor || '#000000',
        team2Color: team2ColorData?.teamColor || '#000000'
    };
};

export const convertDateTimeUTCToLocal = (utcDateTime: string): DateTimeLocal => {
    if (!utcDateTime) {
        return { localDate: '', localTime: '' };
    }

    const date = new Date(utcDateTime);

    // Custom formatting for "DD/MM/YYYY"
    const localDate = date.toLocaleDateString('en-GB');  // 'en-GB' uses DD/MM/YYYY format
    const localTime = date.toLocaleTimeString();

    return { localDate, localTime };
};

export const getMatchType = (cst: number | undefined): string => {
    switch (cst) {
        case 1:
            return 'T20';
        case 2:
            return 'ODI';
        case 3:
            return 'T10';
        case 4:
            return 'Test Match';
        default:
            return '';
    }
};

export const getMatchDetails = (detailsString: string | undefined): {
    runs: number;
    wickets: number;
    overs: number;
} => {
    if (!detailsString) {
        return { runs: 0, wickets: 0, overs: 0 };
    }

    try {
        const details = JSON.parse(detailsString);
        return {
            runs: details.runs || 0,
            wickets: details.wickets || 0,
            overs: details.overs || 0,
        };
    } catch {
        return { runs: 0, wickets: 0, overs: 0 };
    }
};

export const transformToScoreData = (data: CommentaryResponse): ScoreData => {
    interface TeamInnings {
        inningNumber: number;
        score: number | null;
        overs: number | null;
        wickets: number | null;
        isSuperOver?: boolean;
    }

    interface ProcessedTeam {
        id: number;
        name: string;
        image: string;
        shortName: string;
        innings: TeamInnings[];
        crr: number | null;
        rrr: number | null;
        color: string;
        backgroundColor: string;
        currentInning?: number;
    }

    // First process teams with all their innings
    const uniqueTeams = new Map<number, ProcessedTeam>();

    // Sort teams by innings to maintain order
    data.commentaryTeams.sort((a, b) =>
        (a.currentInnings || 0) - (b.currentInnings || 0)
    );

    // Process teams innings-wise
    data.commentaryTeams?.sort((a,b)=> a?.commentaryTeamId - b?.commentaryTeamId).forEach(team => {
        if (!uniqueTeams.has(team.teamId)) {
            uniqueTeams.set(team.teamId, {
                id: team.teamId,
                name: team.teamName,
                image: team.image,
                nimage: team?.nimage,
                shortName: team.shortName,
                innings: [{
                    inningNumber: team.currentInnings || 1,
                    score: team.teamScore,
                    overs: team.teamOver,
                    wickets: team.teamWicket,
                    isSuperOver: team.isSuperOver
                }],
                crr: team.crr,
                rrr: team.rrr,
                color: team.teamColor,
                backgroundColor: team.backgroundColor,
                currentInning: team.currentInnings,
                teamPredictionPercentage: team?.teamPredictionPercentage,
            });
        } else {
            const existingTeam = uniqueTeams.get(team.teamId);
            if (existingTeam) {
                existingTeam.innings.push({
                    inningNumber: team.currentInnings || existingTeam.innings.length + 1,
                    score: team.teamScore,
                    overs: team.teamOver,
                    wickets: team.teamWicket,
                    isSuperOver: team.isSuperOver
                });
                // existingTeam.teamPredictionPercentage = team?.teamPredictionPercentage;
                // Sort innings by inning number
                existingTeam.innings.sort((a, b) => a.inningNumber - b.inningNumber);
            }
        }
    });

    const teams = Array.from(uniqueTeams.values());
    const [team1, team2, team3, team4] = teams;

    // Function to convert innings array to tsi format
    const createTsiArray = (teams: ProcessedTeam[]) => {
        const allInnings: Array<{
            inning: number;
            t1s: string;
            t2s: string;
            t3s: string,
            t4s: string,
            isSuperOver?: boolean;
        }> = [];

        // Get the maximum number of innings played by any team
        const maxInnings = Math.max(...teams.map(t => t.innings.length));

        for (let i = 0; i < maxInnings; i++) {
            allInnings.push({
                inning: i + 1,
                t1s: JSON.stringify(teams[0]?.innings[i] || null),
                t2s: JSON.stringify(teams[1]?.innings[i] || null),
                t3s: JSON.stringify(teams[2]?.innings[i] || null),
                t4s: JSON.stringify(teams[3]?.innings[i] || null),
                isSuperOver: teams[0]?.innings[i]?.isSuperOver || teams[1]?.innings[i]?.isSuperOver
            });
        }

        return allInnings;
    };

    // Get the current run rate
    const currentRunRate = data.commentaryTeams.find(t => t.crr !== null)?.crr || undefined;

    // Process current over
    // const currentOverBalls = data.commentaryBallByBall
    const currentOverBalls = getOvers(data.currOver, data.cbb)
    return {
        t1n: team1.name,
        t2n: team2.name,
        t1im: team1.image,
        t2im: team2.image,
        nt1im: team1.nimage,
        nt2im: team2.nimage,
        t1id: team1.id.toString(),
        t2id: team2.id.toString(),
        com: data.commentaryDetails.competition,
        cinn: data.commentaryDetails.currentInnings,
        res:data.commentaryDetails.result, 
        utc: data.commentaryDetails.eventDate,
        en: data.commentaryDetails?.eventName,
        eno: data.commentaryDetails?.eventNo,
        loc: data.commentaryDetails.location,
        tpp1: team1?.teamPredictionPercentage,
        tpp2: team2?.teamPredictionPercentage,
        cst: getMatchType(data.commentaryDetails.matchType),
        crr: currentRunRate,
        currOver: currentOverBalls,
        dis: data?.liveTabData?.cm?.dis,
        rrr: team1.rrr || team2.rrr || undefined,
        t1co: team1?.color,
        t2co: team2?.color,
        // Current innings scores
        t1MatchDetails: {
            runs: team1.innings[team1.innings.length - 1]?.score || 0,
            wickets: team1.innings[team1.innings.length - 1]?.wickets || 0,
            overs: team1.innings[team1.innings.length - 1]?.overs || 0
        },
        t2MatchDetails: {
            runs: team2.innings[team2.innings.length - 1]?.score || 0,
            wickets: team2.innings[team2.innings.length - 1]?.wickets || 0,
            overs: team2.innings[team2.innings.length - 1]?.overs || 0
        },
        // All innings history
        tsi: createTsiArray(teams),
        battingTeam: {
            bgColor: team1.backgroundColor,
            borderColor: team1.color
        },
        bowlingTeam: {
            bgColor: team2.backgroundColor,
            borderColor: team2.color
        }
    };
};

export const getOvers = (over, allBalls) => {
    let toSend = {}
    let currentBall = {}
    if (!isEmpty(allBalls)) {
      const getBallType = (isb, run, isw, bty) => {
        if (bty == BALL_TYPE_PANELTY_RUN) return "bg-dark";
        if (Object.keys(OTHER_BALLS).includes(String(bty))) return "bg-warning";
        if (isb) return "bg-success";
        if (isw) return "bg-danger";
        if (bty == 0) return "bg-gray over-ball-style";
        if (bty == 9) return "bg-warning";
        if (run) return "";
        return "";
      };
      let currentOver = _.orderBy(allBalls, ["bbi"], ["asc"]).filter(e => !e.isdel && e.bty != 10)
      currentOver.forEach((value, index) => {
        const ballOvetToAdd = Math.floor(value.ocn) + 1
        const previousBall = currentOver?.[index - 1];
        const ballDetailsToUpdate = {
          ...value,
          index,
          opacity: 0.3 + (index / (currentOver?.length || 0.3)),
          ballType: getBallType(value.isb, value.run, value.isw, value.bty),
          actualRun: value.run,
          run: Object.keys(OTHER_BALLS).includes(String(value.bty))
            ? (value.run > 0 ? value.run + " " : "") +
            "" +
            OTHER_BALLS[value.bty]
            : value.isw
              ? previousBall && previousBall.ocn === value.ocn
                ? `${previousBall?.run > 0 ? previousBall.run + " " : ""}${OTHER_BALLS[previousBall.bty] || 0} | W`
                : "w"
              : value.bty == 9 ? "RH"
              : value.bty == 10 ? ""
              : value.bty == 0
                ? `Ov ${(+value.ocn + 1 || 0).toFixed(1)}`
              : value.run
        }
        if (index === currentOver.length - 1) currentBall = ballDetailsToUpdate
        toSend[ballOvetToAdd] = [].concat((toSend[ballOvetToAdd] || []), [ballDetailsToUpdate])
      })
    }
    toSend["currentBall"] = currentBall
    const result = filterOvers(toSend)
    return result
  };

  export const filterOvers = (overs) => {
    Object.keys(overs).forEach(overKey => {
      if (overKey !== 'currentBall') {
        const filteredBalls = [];
        for (let i = 0; i < overs[overKey].length; i++) {
          const currentBall = overs[overKey][i];
          if (currentBall.isw && i > 0) {
            const previousBall = overs[overKey][i - 1];
            if (previousBall.ocn === currentBall.ocn) {
              filteredBalls.pop(); 
            }
          }
          filteredBalls.push(currentBall);
        }
        overs[overKey] = filteredBalls;
      }
    });
    return overs;
  };