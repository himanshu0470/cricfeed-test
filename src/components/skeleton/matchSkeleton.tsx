"use client";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MatchSkeleton = () => {
  return (
      <div className="bg-white rounded-lg container-fluid mx-auto px-4 pb-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-12 md:col-span-3 match-card order-2 md:order-1 py-2 px-2 match-skeleton"></div>
          <div className="col-span-12 md:col-span-6 match-card order-1 md:order-2 overflow-y-auto max-h-[calc(100vh-150px)]">
            <Skeleton width="100%" height={30} />
          </div>
          <div className="col-span-12 md:col-span-3 match-card order-3 md:order-3 py-2 px-2 match-skeleton"></div>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-12 md:col-span-3 match-card order-2 md:order-1 py-2 px-2 match-skeleton"></div>
          <div className="col-span-12 md:col-span-6 match-card order-1 md:order-2 overflow-y-auto max-h-[calc(100vh-150px)]">
            <Skeleton width="100%" height={30} />
            <div className="event-match-card py-2">
              <div className="grid grid-cols-3 gap-4 mx-2 items-center">
                {/* Team 1 */}
                <div className="flex items-center space-x-2 bungee-regular">
                  <Skeleton circle height={40} width={40} />
                  <div>
                    <Skeleton width={60} height={20} />
                    <Skeleton width={40} height={15} />
                  </div>
                </div>

                {/* Match Time */}
                <div className="flex flex-col text-center space-x-2">
                  <Skeleton width={80} height={15} />
                  <Skeleton width={60} height={20} />
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-end space-x-2 bungee-regular">
                  <div>
                    <Skeleton width={60} height={20} />
                    <Skeleton width={40} height={15} />
                  </div>
                  <Skeleton circle height={40} width={40} />
                </div>
              </div>

              {/* Team Names */}
              <div className="mx-2 my-2">
                <Skeleton width="100%" height={20} />
              </div>

              <hr className="border-t border-gray-300 mt-2" />
            </div>
            <div className="event-match-card py-2">
              <div className="grid grid-cols-3 gap-4 mx-2 items-center">
                {/* Team 1 */}
                <div className="flex items-center space-x-2 bungee-regular">
                  <Skeleton circle height={40} width={40} />
                  <div>
                    <Skeleton width={60} height={20} />
                    <Skeleton width={40} height={15} />
                  </div>
                </div>

                {/* Match Time */}
                <div className="flex flex-col text-center space-x-2">
                  <Skeleton width={80} height={15} />
                  <Skeleton width={60} height={20} />
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-end space-x-2 bungee-regular">
                  <div>
                    <Skeleton width={60} height={20} />
                    <Skeleton width={40} height={15} />
                  </div>
                  <Skeleton circle height={40} width={40} />
                </div>
              </div>

              {/* Team Names */}
              <div className="mx-2 my-2">
                <Skeleton width="100%" height={20} />
              </div>

              <hr className="border-t border-gray-300 mt-2" />
            </div>
            <div className="event-match-card py-2">
              <div className="grid grid-cols-3 gap-4 mx-2 items-center">
                {/* Team 1 */}
                <div className="flex items-center space-x-2 bungee-regular">
                  <Skeleton circle height={40} width={40} />
                  <div>
                    <Skeleton width={60} height={20} />
                    <Skeleton width={40} height={15} />
                  </div>
                </div>

                {/* Match Time */}
                <div className="flex flex-col text-center space-x-2">
                  <Skeleton width={80} height={15} />
                  <Skeleton width={60} height={20} />
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-end space-x-2 bungee-regular">
                  <div>
                    <Skeleton width={60} height={20} />
                    <Skeleton width={40} height={15} />
                  </div>
                  <Skeleton circle height={40} width={40} />
                </div>
              </div>

              {/* Team Names */}
              <div className="mx-2 my-2">
                <Skeleton width="100%" height={20} />
              </div>

              <hr className="border-t border-gray-300 mt-2" />
            </div>
            <div className="event-match-card py-2">
              <div className="grid grid-cols-3 gap-4 mx-2 items-center">
                {/* Team 1 */}
                <div className="flex items-center space-x-2 bungee-regular">
                  <Skeleton circle height={50} width={50} />
                  <div>
                    <Skeleton width={60} height={20} />
                    <Skeleton width={40} height={15} />
                  </div>
                </div>

                {/* Match Time */}
                <div className="flex flex-col text-center space-x-2">
                  <Skeleton width={80} height={15} />
                  <Skeleton width={60} height={20} />
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-end space-x-2 bungee-regular">
                  <div>
                    <Skeleton width={60} height={20} />
                    <Skeleton width={40} height={15} />
                  </div>
                  <Skeleton circle height={40} width={40} />
                </div>
              </div>

              {/* Team Names */}
              <div className="mx-2 my-2">
                <Skeleton width="100%" height={20} />
              </div>

              <hr className="border-t border-gray-300 mt-2" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-3 match-card order-3 md:order-3 py-2 px-2 match-skeleton"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-12 md:col-span-3 match-card order-2 md:order-1 py-2 px-2 match-skeleton"></div>
          <div className="col-span-12 md:col-span-6 match-card order-1 md:order-2 overflow-y-auto max-h-[calc(100vh-150px)]">
            <Skeleton width="100%" height={30} />
            
          </div>
          <div className="col-span-12 md:col-span-3 match-card order-3 md:order-3 py-2 px-2 match-skeleton"></div>
        </div>
      </div>
  );
};

export default MatchSkeleton;