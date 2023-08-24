import ReactECharts from 'echarts-for-react'; // or var ReactECharts = require('echarts-for-react');
import React, { useEffect, useState } from 'react';

import fetchData from './index.fetchData';
import fetchIndicators from './index.fetchIndicators';
import generateOption from './index.generateOption';

interface State {
  height: number;
  equityData: number[]; // Replace 'any' with the actual type of equityData
  indData: number[]; // Replace 'any' with the actual type of indData
  dates: number[]; // Replace 'any' with the actual type of dates
  candleData: number[];
  markData: number[];
  scatterData: number[];
}

const defaultState: State = {
  height: 0,
  equityData: [],
  dates: [],
  candleData: [],
  markData: [],
  scatterData: [],
  indicators: [],
};

const Index = () => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    if (state.height === 0) {
      setState((prevState) => ({
        ...prevState,
        height: window.innerHeight,
      }));
      fetchData(setState);
      fetchIndicators(setState);
    }
  }, [state]);

  if (state.height === 0) {
    return <div className="" />;
  }

  if (state.dates.length > 0) {
    return (
      <div className="min-h-screen">
        <ReactECharts
          style={{ height: state.height, width: '100%' }}
          option={generateOption(state)}
          notMerge
          lazyUpdate
          theme="theme_name"
        />
      </div>
    );
  }

  return <div className="" />;
};

export default Index;
