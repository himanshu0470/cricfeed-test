import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";

export const BarChartComponent = ({ graphData, team1, team2, team3, team4, team1Color, team2Color }) => {
  const [showBarCurrentInnings, setShowBarCurrentInnings] = useState(true);

  const mapDataForBar = (data) => {
    const overs =
      data?.length > 0
        ? data?.map((over) => ({
          x: over?.over + 1,
          y: over?.totalRun,
          score: over?.teamScore,
          runs: over?.totalRun,
          wicket: over?.totalWicket,
          hasWicket: over?.totalWicket > 0,
        }))
        : [];
    return overs;
  };

  const calculateOverNo = (maxOver) => {
    if (maxOver <= 5) {
      return maxOver - 1;
    } else if (maxOver <= 10) {
      return Math.ceil(maxOver / 2) - 1;
    } else if (maxOver <= 15) {
      return Math.ceil(maxOver / 3) - 1;
    } else if (maxOver <= 20) {
      return Math.ceil(maxOver / 4) - 1;
    } else if (maxOver <= 25) {
      return Math.ceil(maxOver / 5) - 1;
    } else if (maxOver <= 30) {
      return Math.ceil(maxOver / 6) - 1;
    } else if (maxOver <= 50) {
      return Math.ceil(maxOver / 10) - 1;
    } else if (maxOver <= 100) {
      return Math.ceil(maxOver / 20) - 1;
    } else if (maxOver <= 150) {
      return Math.ceil(maxOver / 30) - 1;
    } else {
      return Math.ceil(maxOver / 50) - 1;
    }
  };

  const barSeries = useMemo(() => {
    return showBarCurrentInnings
      ? [
        {
          name: graphData?.summery?.team2Name,
          data: mapDataForBar(team1),
        },
        {
          name: graphData?.summery?.team1Name,
          data: mapDataForBar(team2),
        },
      ]
      : [
        {
          name: `${graphData?.summery?.team2Name} (Previous Innings)`,
          data: mapDataForBar(team3),
        },
        {
          name: `${graphData?.summery?.team1Name} (Previous Innings)`,
          data: mapDataForBar(team4),
        },
      ];
  }, [showBarCurrentInnings, team1, team2, team3, team4, graphData]);

  const title = useMemo(() => {
    return graphData?.summery?.team1Name || graphData?.summery?.team2Name
      ? `Runs per Over - ${graphData?.summery?.team1Name} vs ${graphData?.summery?.team2Name}`
      : "Runs per Over";
  }, [graphData]);

  const getWicketAnnotationsTeam1 = (data) => {
    return data
      .filter((over) => over.hasWicket)
      .map((over) => ({
        x: over.x - 0.16,
        y: over.y,
        marker: {
          size: 4,
          fillColor: team1Color,
          strokeColor: team1Color,
        },
        label: {
          borderColor: team1Color,
          style: {
            color: "#FFF",
            background: team1Color,
          },
          text: "w",
        },
      }));
  };
  const getWicketAnnotationsTeam2 = (data) => {
    return data
      .filter((over) => over.hasWicket)
      .map((over) => ({
        x: over.x + 0.18,
        y: over.y,
        marker: {
          size: 4,
          fillColor: team2Color,
          strokeColor: team2Color,
        },
        label: {
          borderColor: team2Color,
          style: {
            color: "#FFF",
            background: team2Color,
          },
          text: "w",
        },
      }));
  };

  const maxOver = useMemo(() => {
    return Math.ceil((Math.max(
      ...team1.map(p => p.over),
      ...team2.map(p => p.over),
      ...team3.map(p => p.over),
      ...team4.map(p => p.over)
    ) + 1) / 5) * 5;
  }, [team1, team2, team3, team4]);

  const overNo = useMemo(() => calculateOverNo(maxOver), [maxOver]);

  const barOptions = {
    chart: {
      type: "bar",
      zoom: {
        enabled: true,
      },
      background: "#ffffff",
      events: {
        zoomed: function (chartContext, { xaxis }) {
          const zoomMinOver = Math.floor((xaxis.min) / 5) * 5;
          const zoomMaxOver = Math.ceil((xaxis.max + 1) / 5) * 5;
          const range = zoomMaxOver - zoomMinOver;
          if (range > 0) {
            const zoomOverNo = calculateOverNo(range);
            chartContext.updateOptions({
              xaxis: {
                min: zoomMinOver,
                max: zoomMaxOver,
                tickAmount: zoomOverNo,
                labels: {
                  formatter: function (val) {
                    return val.toFixed(1) + " ov";
                  },
                },
              },
            }, false);
          }
        },
        legendClick: function (chartContext, seriesIndex, config) {
          const isTeam1Visible = chartContext.w.globals.series[0].length !== 0;
          const isTeam2Visible = chartContext.w.globals.series[1].length !== 0;
          let updatedAnnotations = [];
          if (seriesIndex === 0) {
            if (!isTeam1Visible) {
              updatedAnnotations.push(...getWicketAnnotationsTeam1(barSeries[0].data));
            }
            if (isTeam2Visible) {
              updatedAnnotations.push(...getWicketAnnotationsTeam2(barSeries[1].data));
            }
          } else if (seriesIndex === 1) {
            if (!isTeam2Visible) {
              updatedAnnotations.push(...getWicketAnnotationsTeam2(barSeries[1].data));
            }
            if (isTeam1Visible) {
              updatedAnnotations.push(...getWicketAnnotationsTeam1(barSeries[0].data));
            }
          }
          chartContext.updateOptions({
            annotations: {
              points: updatedAnnotations,
            },
          });
          return false;
        },
      },
    },
    title: {
      text: title,
      align: "left",
      style: {
        fontSize: "16px",
      },
    },
    xaxis: {
      title: {
        text: "Overs",
      },
      // categories: team1.map((point) => point.x),
      min: 0,
      max: maxOver,
      tickAmount: overNo,
      labels: {
        formatter: function (val) {
          return val.toFixed(1) + " ov";
        },
      },
    },
    yaxis: {
      title: {
        text: "Runs",
      },
      min: 0,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: false,
      intersect: true,
      y: {
        formatter: function (y, { series, seriesIndex, dataPointIndex, w }) {
          const overData = w.config.series[seriesIndex].data[dataPointIndex];
          const totalRuns = overData?.runs || 0;
          const teamScore = overData?.score || "0/0";
          const totalWicket = overData?.wicket || 0;
          return `${totalRuns} runs | ${totalWicket} wicket [${teamScore}]`;
        },
      },
    },
    annotations: {
      points: [
        ...getWicketAnnotationsTeam1(barSeries[0].data),
        ...getWicketAnnotationsTeam2(barSeries[1].data),
      ],
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    colors: [team2Color || "#008FFB", team1Color || "#00E396"],
    legend: {
      position: "top",
      horizontalAlign: "right",
      onItemClick: {
        toggleDataSeries: true,
      },
    },
  };

  const handleBarToggleInnings = () => {
    setShowBarCurrentInnings(!showBarCurrentInnings);
  };

  return (
    <>
      {team3?.length > 0 && team4?.length > 0 ? (
        <button
          type="button"
          className="bg-white text-gray-800 hover:bg-gray-200 border border-gray-300 py-1 px-3 text-sm rounded-md transition duration-150 ease-in-out"
          onClick={handleBarToggleInnings}
        >
          {showBarCurrentInnings
            ? "Show Previous Innings"
            : "Show Current Innings"}
        </button>
      ) : null}
      <Chart options={barOptions} series={barSeries} type="bar" height={350} />
    </>
  );
};