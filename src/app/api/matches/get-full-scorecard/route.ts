import { CONFIG } from "@/config/config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { commentaryId } = await request.json();
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.GET_FULL_SCORECARD_BY_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentaryId }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch scorecard' }, { status: 500 });
    }
}



// import { CONFIG } from "@/config/config";
// import { NextResponse } from "next/server";
// import { getGlobalData } from "@/utils/fetchData";

// export async function POST(request: Request) {
//   try {
//     const { eventId } = await request.json();

//     const response = await fetch(
//       `${CONFIG.SCORE_API_BASE_URL}${CONFIG.SCORE_API_ENDPOINTS.GET_ALL_COMMENTARIES}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ eventId }),
//       }
//     );

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "Failed to fetch data from the score API" },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();

//     if (!data || !data[eventId]) {
//       return NextResponse.json({ eventId, value: [] });
//     }

//     const globalData = getGlobalData();
//     globalData.tblFullScoreDetails[eventId] = data[eventId];

//     const updatedData = data[eventId];

//     const formattedData = [
//       {
//         type: "full",
//         module: "commentaryDetails",
//         data: updatedData.commentaryDetails,
//       },
//       {
//         type: "full",
//         module: "commentaryTeams",
//         data: updatedData.commentaryTeams,
//       },
//       {
//         type: "full",
//         module: "commentaryPlayers",
//         data: updatedData.commentaryPlayers,
//       },
//       {
//         type: "full",
//         module: "commentaryBallByBall",
//         data: updatedData.commentaryBallByBall,
//       },
//       {
//         type: "full",
//         module: "commentaryWicket",
//         data: updatedData.commentaryWicket,
//       },
//       {
//         type: "full",
//         module: "commentaryOvers",
//         data: updatedData.commentaryOvers,
//       },
//       {
//         type: "full",
//         module: "commentaryPartnership",
//         data: updatedData.commentaryPartnership,
//       },
//       {
//         type: "full",
//         module: "marketOddsBallByBall",
//         data: updatedData.marketOddsBallByBall,
//       },
//     ];

//     return NextResponse.json({
//       eventId,
//       value: formattedData,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch scorecard" },
//       { status: 500 }
//     );
//   }
// }
