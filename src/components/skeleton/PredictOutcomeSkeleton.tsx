import React from "react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

const PredictOutcomeSkeleton = ({ login }: any) => {
  return (
    <div className="acr-body bg-white rounded-lg">
      <div className="card shadow-lg p-0 rounded-2xl relative">
        {login && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full text-center opacity-80">
            <Link
              href="/login"
              className="btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm mx-auto z-0"
            >
              Login
            </Link>
          </div>
        )}
        <div className="table-responsive table-scrollbar">
          <table className="widget-table table market-table table-striped no-border text-black">
            <thead>
              <tr>
                <th scope="col">Session</th>
                <th scope="col">Open</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Skeleton width={120} />
                </td>
                <td>
                  <Skeleton width={40} />
                </td>
                <td>
                  <Skeleton width={40} height={40} />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton width={120} />
                </td>
                <td>
                  <Skeleton width={40} />
                </td>
                <td>
                  <Skeleton width={40} height={40} />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton width={120} />
                </td>
                <td>
                  <Skeleton width={40} />
                </td>
                <td>
                  <Skeleton width={40} height={40} />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton width={120} />
                </td>
                <td>
                  <Skeleton width={40} />
                </td>
                <td>
                  <Skeleton width={40} height={40} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PredictOutcomeSkeleton;