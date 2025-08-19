import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LiveScoreboardProps, BatsmanData, BowlerData, OverBall } from "@/types/full-score/fullScore";
import PlayerImage from '../shared/PlayerImage';
// import Image from 'next/image';
import AppImage from '@/constants/AppImage';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

// Shared Table Component
const Table = ({ children, className = "" }: TableProps) => (
  <div className="w-full overflow-x-auto scrollbar-thin scrollbar-hidden hover:scrollbar">
    <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
      {children}
    </table>
  </div>
);

export default function LiveScoreboard({
  commentaryData,
  // imgBaseUrl,
  loading = false
}: LiveScoreboardProps) {
  const [batsmen, setBatsmen] = useState<BatsmanData[]>([]);
  const [bowlers, setBowlers] = useState<BowlerData[]>([]);
  const [currentOver, setCurrentOver] = useState<OverBall[]>([]);

  // Update states when commentaryData changes
  useEffect(() => {
    if (commentaryData) {
      setBatsmen(commentaryData.cbt || []);
      setBowlers(commentaryData.cbl || []);
      setCurrentOver(commentaryData.currOver || []);
    }
  }, [commentaryData]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-12 mb-4 rounded"></div>
        <div className="bg-gray-200 h-64 rounded"></div>
      </div>
    );
  }

  if (!commentaryData) return null;

  const getJerseyImage = (isFirstTeam: boolean) => {
    const { cm } = commentaryData;
    return isFirstTeam
      ? (cm.scot === cm.t1sn ? cm.t2jr : cm.t1jr)
      : (cm.scot === cm.t2sn ? cm.t1jr : cm.t2jr);
  };

  // const uniqueOver = currentOver.filter(
  //   (ball, index, self) =>
  //     index === self.findIndex((b) => b.commentaryBallByBallId === ball.commentaryBallByBallId)
  // );

  return (
    <div className="space-y-3">
      {/* Batsmen Section */}
      <section className="shadow overflow-hidden">
        <Table>
          <thead className="bg-gray-50 py-1 batsmen-header">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Batsmen
              </th>
              <th className="px-6 py-3 text-center text-xs font-mediumuppercase tracking-wider">R</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">B</th>
              <th className="px-6 py-3 text-center text-xs font-medium lowercase tracking-wider">4s</th>
              <th className="px-6 py-3 text-center text-xs font-medium lowercase tracking-wider">6s</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">SR</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {batsmen?.map((batsman, index) => (
              <tr key={`batsman-${index}`}>
                <td className="px-6 py-1 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* <PlayerImage
                      width="40px"
                      playerImage={batsman.bati}
                      jerseyImage={commentaryData?.cm?.scot === commentaryData?.cm?.t1sn
                        ?  commentaryData?.cm?.t1jr
                        :  commentaryData?.cm?.t2jr}
                    /> */}
                    {/* <Image
                      src={`${imgBaseUrl}${batsman?.jrsyplyimg}`}
                      alt="Player"
                      width={32}
                      height={30}
                    /> */}
                    <AppImage
                      src={batsman?.jrsyplyimgpath}
                      alt="Player"
                      width={32}
                      height={30}
                    />
                    <Link
                      href="/#"
                      className="ml-4 text-sm font-medium text-gray-900"
                    >
                      {batsman.batn} {batsman.os && "*"}
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-center font-bold">{batsman.trun}</td>
                <td className="px-6 py-1 whitespace-nowrap text-center">{batsman.tball}</td>
                <td className="px-6 py-1 whitespace-nowrap text-center">{batsman.t4}</td>
                <td className="px-6 py-1 whitespace-nowrap text-center">{batsman.t6}</td>
                <td className="px-6 py-1 whitespace-nowrap text-center">
                  {parseFloat(String(batsman.str)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Bowlers Section */}
        <Table>
          <thead className="bg-gray-50 batsmen-header">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Bowler
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">O</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">M</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">R</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">W</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Econ</th>
              {/* <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">0s</th> */}
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">4s</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">6s</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">WD</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">NB</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bowlers.map((bowler, index) => (
              <tr key={`bowler-${index}`}>
                <td className="px-6 py-1 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* <PlayerImage
                      width="40px"
                      playerImage={bowler.bli}
                      jerseyImage={commentaryData?.cm?.scot === commentaryData?.cm?.t2sn
                        ?  commentaryData?.cm?.t1jr
                        :  commentaryData?.cm?.t2jr}
                    /> */}
                    {/* <Image
                      src={`${imgBaseUrl}${bowler?.jrsyplyimg}`}
                      alt="Player"
                      width={32}
                      height={30}
                    /> */}
                    <AppImage
                      src={bowler?.jrsyplyimgpath}
                      alt="Player"
                      width={32}
                      height={30}
                    />
                    <Link
                      href="/#"
                      className="ml-4 text-xs font-medium text-gray-900"
                    >
                      {bowler.pn}*
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-center font-bold">
                  {parseFloat(String(bowler.tov)).toFixed(1)}
                </td>
                <td className="px-6 py-1 whitespace-nowrap text-center">{bowler.mov}</td>
                <td className="px-6 py-1 whitespace-nowrap text-center">{bowler.trun}</td>
                <td className="px-6 py-1 whitespace-nowrap text-center">{bowler.twik}</td>
                <td className="px-6 py-1 whitespace-nowrap text-center">
                  {parseFloat(String(bowler.eco)).toFixed(2)}
                </td>
                {/* <td className="px-6 py-1 whitespace-nowrap text-center">{bowler.trun}</td> */}
                <td className="px-6 py-1 whitespace-nowrap text-center">{bowler.t4 || 0}</td>
                <td className="px-6 py-1 whitespace-nowrap text-center">{bowler.t6 || 0}</td>
                <td className="px-6 py-1 whitespace-nowrap text-center">{bowler.twb || 0}</td>
                <td className="px-6 py-1 whitespace-nowrap text-center">{bowler.tnb || 0}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* Recent Overs Section */}
      {/* <section className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Recent:</span>
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-hidden hover:scrollbar">
            {uniqueOver.map((ball, index) => (
              <span
                key={`ball-${index}`}
                className={`
        flex-shrink-0 border inline-flex items-center justify-center w-8 h-8 rounded
        ${ball.ballType === 'wicket' ? 'bg-red-100 text-red-800' :
                    ball.ballType === 'boundary' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
      `}
              >
                {ball.ballType === 'wicket' ? `${ball.run > 0 ? ball.run : "" } W` : ball.run}
              </span>
            ))}
          </div>
        </div>
      </section> */}
      <section className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Recent:</span>
          <div className="flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-hidden hover:scrollbar">
              {currentOver?.map((value, index) => (
                <span key={`ball-${index}`} className={`flex-shrink-0 border inline-flex items-center justify-center min-w-8 h-8 rounded ${value.ballType} border-black`} style={{ borderRadius:"5px !important"}}>{value.run}</span>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}