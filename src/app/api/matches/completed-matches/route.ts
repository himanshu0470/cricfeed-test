import { CONFIG } from "@/config/config";
import { NextResponse } from "next/server";
// import { getGlobalData } from "@/utils/fetchData";


export async function POST(request: Request) {
    // console.log("request", request)
  try {
      const { page = 1, limit = 20, whitelabelId } = await request.json();

      const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.API_ENDPOINTS.GET_COMPLETE_MATCH_LIST}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ page, limit, whitelabelId }),
      });

      const data = await response.json();
      return NextResponse.json(data);
  } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch completed matches' }, { status: 500 });
  }
}

// export async function POST(request: Request) {
//   try {
//     const { page = 1, limit = 10 } = await request.json();

//     const globalData = getGlobalData();

//     const allData = globalData.tblCompleteMatches;

//     if (!allData || !Array.isArray(allData)) {
//       throw new Error(
//         "Global data for tblCompleteMatches is not available or invalid."
//       );
//     }

//     const startIndex = (page - 1) * limit;
//     const paginatedData = allData.slice(startIndex, startIndex + limit);

//     const totalItems = allData.length;
//     const totalPages = Math.ceil(totalItems / limit);

//     return NextResponse.json({
//       message: "Match fetched successfully",
//       result: {
//         totalItems,
//         currentPage: page,
//         totalPages,
//         data: paginatedData,
//       },
//       status: 200,
//       success: true,
//       title: "Match",
//     });
//   } catch (error: any) {
//     console.error("Error in POST /completed-matches:", error.message);
//     return NextResponse.json(
//       { error: error.message || "Failed to fetch data from global config" },
//       { status: 500 }
//     );
//   }
// }
