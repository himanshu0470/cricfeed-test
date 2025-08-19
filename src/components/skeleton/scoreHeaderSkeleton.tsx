"use client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ScoreHeaderSkeleton = () => {
  return (
    <div className="bg-white rounded-lg match-card hover:shadow-md transition-shadow">
      <div className="rounded-lg relative">
        <Skeleton className="mx-2 my-2" width="96%" height={15} />

        <div className="grid grid-cols-2">
          <div className="flex items-center mx-2">
            <Skeleton circle height={50} width={50} />
            <div className="score1">
              <Skeleton width={50} height={20} />
              <Skeleton width={50} height={20} />
            </div>
          </div>

          <div className="flex items-center justify-end mx-2">
            <div className="score2">
              <Skeleton width={50} height={20} />
              <Skeleton width={50} height={20} />
            </div>
            <Skeleton circle height={50} width={50} />
          </div>
        </div>

        <Skeleton className="mx-2 my-2" width="96%" height={15}/>
      </div>
    </div>
  );
};

export default ScoreHeaderSkeleton;