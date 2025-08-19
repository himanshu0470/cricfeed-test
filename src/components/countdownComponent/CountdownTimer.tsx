import React from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import "./Timer.css";

interface CountdownTimerProps {
  scoreData?: {
    utc?: string;
  };
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ scoreData }) => {
  const matchStartTime = scoreData?.utc;

  const StartTime = matchStartTime ? new Date(matchStartTime).getTime() : 0;
  const currentTime = new Date().getTime();

  const matchHasStarted = StartTime && currentTime > StartTime;

  return (
    <div className="flex flex-col items-center h-[32px]">
      <div className="">
        {/* <span className="text-gray-700 font-medium">Starting</span> */}
        <FlipClockCountdown
          to={matchStartTime || ""}
          className="flip-clock flex justify-center"
          labels={['DAYS', 'HR', 'MIN', 'SEC']}
          renderMap={[false, true, true, true]}
        />
      </div>
    </div>
  );
};

export default CountdownTimer;
