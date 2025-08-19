// import axiosInstance from "../utils/axios";
// import { CONFIG } from "@/config/config";

// export const getAllBlocks = async (): Promise<any[]> => {
//   try {
//     const response = await axiosInstance.post(CONFIG.SCORE_API_ENDPOINTS.GET_ALL_BLOCKS, {
//         isShowContent : true
//     });
//     return response.data.result || [];
//   } catch (error: any) {
//     console.error("Error in getAllBlocks:", error.message || error);
//     return [];
//   }
// };