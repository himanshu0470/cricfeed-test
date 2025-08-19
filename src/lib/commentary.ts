// import axiosInstance from "../utils/axios";
// import { CONFIG } from "@/config/config";

// export const getCompletedMatches = async (): Promise<any[]> => {
//   try {
//     const response = await axiosInstance.post(CONFIG.SCORE_API_ENDPOINTS.GET_ALL_COMPLETED_MATCHES, {});
//     return response.data.result || [];
//   } catch (error: any) {
//     console.error("Error in getCompletedMatches:", error.message || error);
//     return [];
//   }
// };

// export const getScheduleMatches = async (): Promise<any[]> => {
//   try {
//     const response = await axiosInstance.post(CONFIG.SCORE_API_ENDPOINTS.GET_ALL_SCHEDULE_MATCHES, {});
//     return response.data.result || [];
//   } catch (error: any) {
//     console.error("Error in getScheduleMatches:", error.message || error);
//     return [];
//   }
// };

// export const getLiveMatches = async (): Promise<any[]> => {
//   try {
//     const response = await axiosInstance.post(CONFIG.SCORE_API_ENDPOINTS.GET_ALL_LIVE_MATCHES, {});
//     return response.data.result || [];
//   } catch (error: any) {
//     console.error("Error in getLiveMatches:", error.message || error);
//     return [];
//   }
// };

// export const getAllCommentaries = async (): Promise<any[]> => {
//   try {
//     const response = await axiosInstance.post(CONFIG.SCORE_API_ENDPOINTS.GET_ALL_COMMENTARIES,{});
//     return response.data.result || [];
//   } catch (error: any) {
//     console.error("Error in getAllCommentaries:", error.message || error);
//     return [];
//   }
// };

// export const getAllMarketTypeAndCategory = async (): Promise<any[]> => {
//   try {
//     const response = await axiosInstance.post(CONFIG.SCORE_API_ENDPOINTS.GET_ALL_MARKETTYPES_AND_CATEGORIES,{
//       isActive : true
//   });
//     return response.data.result || [];
//   } catch (error: any) {
//     console.error("Error in getAllMarketTypeAndCategory:", error.message || error);
//     return [];
//   }
// };