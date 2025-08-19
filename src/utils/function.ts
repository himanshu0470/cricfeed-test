import { BALL_TYPE_PANELTY_RUN, OTHER_BALLS } from "@/constants/fullScoreConst";
import { MarketRunner } from "@/types/market";
import moment from "moment-timezone";

export const LIVE = "LIVE";
export const UPCOMMING = "UPCOMING";
export const RESULT = "RESULT";

export const getMatchDetails = (scores: string) => {
  if (scores) {
    const matches = scores.split(" & ").map((match) => match.trim());

    // Extracting innings details for each match
    const inningsDetails = [...matches];

    // Extracting final innings details for the last match safely
    const lastMatch = matches.pop();
    if (lastMatch) {
      const finalMatchDetails = lastMatch.split("(");

      // Check if there is a valid 'overs' portion
      const overs = finalMatchDetails[1]?.split(")")[0] || "0";

      // Check if we have run/wicket details and parse them safely
      const runWicketDetails = finalMatchDetails[0].split("/");
      const runs = parseInt(runWicketDetails[0] || "0");
      const wickets = parseInt(runWicketDetails[1] || "0");

      const previousInnings = matches.reverse();
      return {
        inningsDetails,
        previousInnings,
        runs,
        wickets,
        overs,
      };
    }
  }

  // Return default values if `scores` is empty or invalid
  return {
    inningsDetails: [],
    previousInnings: [],
    runs: 0,
    wickets: 0,
    overs: "0",
  };
};

export const formatDate = (dateString: string) => {
  // Split the date string into parts
  const [day, month, year] = dateString.split("/");

  // Create a new date object in YYYY-MM-DD format
  const formattedDateString = `${year}-${month}-${day}`;

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // Use specific string literals that TypeScript expects
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Convert to date and format it
  return new Date(formattedDateString)
    .toLocaleDateString("en-US", options)
    .toUpperCase();
};

// export function formatDate(dateString: string) {
//   const date = new Date(dateString);
  
//   const options: Intl.DateTimeFormatOptions = { 
//     weekday: 'short', // "Thu"
//     year: 'numeric',  // "2025"
//     month: 'short',   // "Jan"
//     day: 'numeric'    // "16"
//   };
  
//   return date.toLocaleDateString('en-US', options).toUpperCase(); // Output: "THU, JAN 16, 2025"
// }


export const getMatchType = (matchType: number) => {
  matchType = Number(matchType); // Ensure matchType is a number
  if (matchType === 2 || matchType === 3) return LIVE;
  if (matchType === 1) return UPCOMMING;
  if (matchType === 4) return RESULT;
  return "UNKNOWN"; // Handle unexpected values
};

export const sortMatchesByDateTime = (matches: any[], ascending = true) => {
  matches.sort((a, b) => {
    const dateA = moment(a.utc);
    const dateB = moment(b.utc);
    if (dateA < dateB) return ascending ? -1 : 1;
    if (dateA > dateB) return ascending ? 1 : -1;
    return 0;
  });

  return matches;
}

export const convertDateTimeUTCToLocal = (datetime: string | undefined) => {
  if (!datetime) {
    return { localDate: "", localTime: "" }; // Return an object with empty strings
  }

  const localDate = moment.utc(datetime, "YYYY/MM/DD").local().format("DD/MM/YYYY");
  const localTime = moment.utc(datetime).local().format("hh:mm A");

  return { localDate, localTime };
};

// export const teamRunnerSocket = (
//   marketRunners: MarketRunner[],
//   teamId: string | number | undefined,
//   teamName: string | undefined
// ) => {
//   if (!marketRunners?.length || !teamId || !teamName) return null;

//   // First try to find by selection ID (team ID)
//   let runner = marketRunners.find(
//     (item) => item.selectionId?.toString() === teamId?.toString() && item.status === 'ACTIVE'
//   );

//   // If not found by ID, try to find by team name
//   if (!runner && teamName) {
//     // Create variations of team name to match possible formats
//     const teamVariations = [
//       teamName,
//       teamName.toLowerCase(),
//       teamName.toUpperCase(),
//       teamName.replace(/\s+/g, ''),  // Remove spaces
//       teamName.replace(/\s+/g, '-'), // Replace spaces with hyphens
//     ];

//     runner = marketRunners.find(
//       (item) =>
//         item.status === 'ACTIVE' &&
//         teamVariations.some(variation =>
//           item.runner?.toLowerCase() === variation.toLowerCase()
//         )
//     );
//   }

//   if (!runner) return null;

//   return {
//     selectionId: runner.selectionId,
//     teamName: teamName,
//     backPrice: parseFloat(runner.backPrice?.toString() || '0'),
//     layPrice: parseFloat(runner.layPrice?.toString() || '0'),
//     status: runner.status
//   };
// };

export const teamRunnerSocket = (market: any[], teamId: string | number | undefined, teamName: string | undefined) => {
  if(market?.length > 0){
   const runnerById = (teamId && market) && market.find((item:any) => item.teamId == teamId);
   const runnerByName = (teamName && market) && market.find((item:any) => String(item.runner).toLowerCase() === String(teamName).toLowerCase());
   const runner = runnerById || runnerByName
   return runner
  }
}

export const filterOvers2 = (overs: any[]) => {
  const filteredOvers = [];
  for (let i = 0; i < overs.length; i++) {
    const currentBall = overs[i];
    if (currentBall.isw && i > 0) {
      const previousBall = overs[i - 1];
      if (previousBall.ocn === currentBall.ocn) {
        filteredOvers.pop(); 
      }
    }
    filteredOvers.push(currentBall);
  }
  return filteredOvers;
};

export const getCurrentOver = (over: string, allBalls: any[]) => {
  if (allBalls) {
    let toSend = []
    let currentBall = allBalls.find((value) => value.ocn == over);
    const getBallType = (isb: any, run: any, isw: any, bty: any) => {
      if (bty == BALL_TYPE_PANELTY_RUN) return "bg-gray-200 text-gray-800";
      if (Object.keys(OTHER_BALLS).includes(String(bty))) return "bg-[#ffc107] text-black";
      if (isb) return "bg-[#32cf8a] text-white";
      if (isw) return "bg-red-500 text-white";
      if (bty == 0) return "bg-gray-200 text-gray-800 px-1.5";
      if (bty == 9) return "bg-[#ffc107] text-black";
      if (run) return "";
      return "";
    };
    if (currentBall) {
      const currentOver = allBalls.sort((a, b) => parseInt(a.bbi) - parseInt(b.bbi)).filter(
        (value) => /* value.oid === currentBall.oid && */ !value.isdel && value.bty != 10
      );
      toSend = currentOver.map((value,index) => {
        const previousBall = currentOver?.[index - 1];
        return {
        ...value,
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
              ? `${(+value.ocn+1 || 0)} ov`
              : value.run
        }
      });
    }
    const result = filterOvers2(toSend)
    return result
  }
};
