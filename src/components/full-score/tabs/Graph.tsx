// components/Chart/FullscoreChart.tsx
'use client';

import React from 'react';
import { LineChartComponent } from "../shared/LineChart"
import { BarChartComponent } from "../shared/BarChart"
import { ChartComponentProps } from '@/types/full-score/charts';
import { isEmpty } from 'lodash';
export default function GraphTab({ graphData }: ChartComponentProps) {

  if (isEmpty(graphData)) {
    return null;
  }

  return (
    <div>
      <LineChartComponent
        graphData={graphData}
        team1={graphData.team1Data}
        team2={graphData.team2Data}
        team3={graphData.team3Data}
        team4={graphData.team4Data}
        team1Color={graphData.team1Color}
        team2Color={graphData.team2Color}
      />
      <BarChartComponent
        graphData={graphData}
        team1={graphData.team1Data}
        team2={graphData.team2Data}
        team3={graphData.team3Data}
        team4={graphData.team4Data}
        team1Color={graphData.team1Color}
        team2Color={graphData.team2Color}
      />
    </div>
  );
}