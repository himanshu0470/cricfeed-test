// import { getAllNews } from "@/lib/news";
// import { getAllBanners } from "@/lib/banner";
// import { getAllConfigs } from "@/lib/configs";
// import { getCompletedMatches, getScheduleMatches, getLiveMatches, getAllCommentaries, getAllMarketTypeAndCategory } from "@/lib/commentary";
// import { getMenuItems, getAllMenuTypes, getMenuItemsList } from "@/lib/menuItems";
// import { getAllPages, getAllPageFormates } from "@/lib/pages";
// import { getAllBlocks } from "@/lib/block";
// import { getAllCompetitions } from "@/lib/competition";

// interface GlobalData {
//   tblNews: any[];
//   tblBanner: any[];
//   tblConfig: any[];
//   tblCompleteMatches: any[];
//   tblScheduleMatches: any[];
//   tblMenuItemList: any[];
//   tblPages: any[];
//   tblLiveMatches: any[];
//   tblFullScoreDetails: any[];
//   tblBlocks: any[];
//   tblPageFormats: any[];
//   tblMenuTypes: any[];
//   tblMenuItems: any[];
//   tblMarketTypeAndCategory: any[];
//   tblCompetitions: any[];
// }

// const globalData: GlobalData = {
//   tblNews: [],
//   tblBanner: [],
//   tblConfig: [],
//   tblCompleteMatches: [],
//   tblScheduleMatches: [],
//   tblMenuItemList: [],
//   tblPages: [],
//   tblLiveMatches: [],
//   tblFullScoreDetails: [],
//   tblBlocks: [],
//   tblPageFormats: [],
//   tblMenuTypes: [],
//   tblMenuItems: [],
//   tblMarketTypeAndCategory: [],
//   tblCompetitions: [],
// };

// const loadAllData = async (): Promise<void> => {
//   try {

//     if (globalData.tblNews.length > 0 && globalData.tblBanner.length > 0 && globalData.tblConfig.length > 0) {
//       return;
//     }

//     const [
//       newsList,
//       bannerList,
//       allConfigs,
//       completeMatchesList,
//       scheduleMatches,
//       menuItemList,
//       pagesList,
//       liveMatchesList,
//       scoreDetials,
//       getBlocks,
//       getPageFormates,
//       getMenuTypes,
//       getAllMenuItems,
//       getMarketTypeAndCategories,
//       tblCompetitions,
//     ] = await Promise.all([
//       getAllNews(),
//       getAllBanners(),
//       getAllConfigs(),
//       getCompletedMatches(),
//       getScheduleMatches(),
//       getMenuItemsList(),
//       getAllPages(),
//       getLiveMatches(),
//       getAllCommentaries(),
//       getAllBlocks(),
//       getAllPageFormates(),
//       getAllMenuTypes(),
//       getMenuItems(),
//       getAllMarketTypeAndCategory(),
//       getAllCompetitions(),
//     ]);


//     globalData.tblNews = newsList;
//     globalData.tblBanner = bannerList;
//     globalData.tblConfig = allConfigs;
//     globalData.tblCompleteMatches = completeMatchesList;
//     globalData.tblScheduleMatches = scheduleMatches;
//     globalData.tblMenuItemList = menuItemList;
//     globalData.tblPages = pagesList;
//     globalData.tblLiveMatches = liveMatchesList;
//     globalData.tblFullScoreDetails = scoreDetials;
//     globalData.tblBlocks = getBlocks;
//     globalData.tblPageFormats = getPageFormates;
//     globalData.tblMenuTypes = getMenuTypes;
//     globalData.tblMenuItems = getAllMenuItems;
//     globalData.tblMarketTypeAndCategory = getMarketTypeAndCategories;
//     globalData.tblCompetitions = tblCompetitions;

//   } catch (error: any) {
//     console.error("Error in loadAllData:", error.message);
//   }
// };

// const getGlobalData = (): GlobalData => {
//   return globalData;
// };


// export { loadAllData, getGlobalData };
