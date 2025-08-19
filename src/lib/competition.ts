// import axiosInstance from "../utils/axios";
// import { CONFIG } from "@/config/config";

// export const getAllCompetitions = async (): Promise<any[]> => {
//   try {
//     const response = await axiosInstance.post(CONFIG.SCORE_API_ENDPOINTS.GET_ALL_COMPETITIONS, {
//       isActive: true,
//       isTrending: true,
//     });
//     return response.data.result || [];
//   } catch (error: any) {
//     console.error("Error in getAllCompetitions:", error.message || error);
//     return [];
//   }
// };
