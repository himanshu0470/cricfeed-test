import { Dispatch, SetStateAction } from "react";

type TabId =
  | "live"
  | "scorecard"
  | "commentary"
  | "team"
  | "partnership"
  | "overs"
  | "graph"
  | "predict"
  | "outcome";

  interface ShowHideTabs {
  showPredictTab: boolean;
  showOutcomeTab: boolean;
}

interface TabNavigationProps {
  activeTab: TabId;
  setActiveTab: Dispatch<SetStateAction<TabId>>;
  isShowClient: boolean;
  inProgress: boolean;
  commentaryStatus: number;
  showHideTabs: ShowHideTabs;
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
  isShowClient,
  inProgress,
  commentaryStatus,
  showHideTabs,
}: TabNavigationProps) {
  let TABS = [
    { id: "live" as TabId, label: "LIVE" },
    { id: "scorecard" as TabId, label: "SCORECARD" },
    { id: "commentary" as TabId, label: "COMMENTARY" },
    { id: "team" as TabId, label: "TEAM" },
    { id: "partnership" as TabId, label: "PARTNERSHIP" },
    { id: "overs" as TabId, label: "OVERS" },
    { id: "graph" as TabId, label: "GRAPH" },
  ];
  if (showHideTabs.showPredictTab) {
    TABS.push({ id: "predict" as TabId, label: "PREDICT" });
  }
  if (showHideTabs.showOutcomeTab) {
    TABS.push({ id: "outcome" as TabId, label: "OUTCOME" });
  }

  const filteredTabs =
    inProgress && isShowClient
      ? TABS // Show all tabs when isShowClient is true
      : (inProgress || commentaryStatus === 4) && !isShowClient
      ? TABS.filter(
          (tab) => !["live", "scorecard", "partnership"].includes(tab.id)
        )
      : !inProgress && commentaryStatus === 4 && isShowClient
      ? TABS.filter((tab) => !["live"].includes(tab.id))
      : TABS.filter((tab) => ["team"].includes(tab.id));

  return (
    <div className="rounded-lg shadow-md bg-white mb-3 p-4">
      <nav className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-hidden hover:scrollbar">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${
                activeTab === tab.id
                  ? "bg-emerald-400 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
