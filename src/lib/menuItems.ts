// import axiosInstance from "../utils/axios";
// import { CONFIG } from "@/config/config";

// export const getMenuItemsList = async (): Promise<any[]> => {
//   try {
//     const response = await axiosInstance.post(CONFIG.SCORE_API_ENDPOINTS.GET_MENU_ITEMS_LIST, {});
//     return response.data.result || [];
//   } catch (error: any) {
//     console.error("Error in getMenuItems:", error.message || error);
//     return [];
//   }
// };

// export const getAllMenuTypes = async (): Promise<any[]> => {
//   try {
//     const response = await axiosInstance.post(CONFIG.SCORE_API_ENDPOINTS.GET_ALL_MENUTYPES, {});
//     return response.data.result || [];
//   } catch (error: any) {
//     console.error("Error in getMenuItems:", error.message || error);
//     return [];
//   }
// };

// export const getMenuItems = async (): Promise<any[]> => {
//   try {
//     const response = await axiosInstance.post(CONFIG.SCORE_API_ENDPOINTS.GET_ALL_MENU_ITEMS, {});
//     return response.data.result || [];
//   } catch (error: any) {
//     console.error("Error in getMenuItems:", error.message || error);
//     return [];
//   }
// };