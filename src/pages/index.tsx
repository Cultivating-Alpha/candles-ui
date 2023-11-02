import ReactECharts from "echarts-for-react"; // or var ReactECharts = require('echarts-for-react');
import React, { useEffect, useState } from "react";

import fetchData from "@/components/index.fetchData";
import fetchIndicators from "@/components/index.fetchIndicators";
import fetchTradeArrows from "@/components/index.fetchTradeArrows";
import generateOption from "@/components/index.generateOption";

import { DownloadOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Radio } from "antd";

interface State {
  height: number;
  equityData: number[]; // Replace 'any' with the actual type of equityData
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
};

const Index = () => {
  const [state, setState] = useState(defaultState);
  const [direction, setDirection] = useState(2);

  useEffect(() => {
    if (state.height === 0) {
      setState((prevState) => ({
        ...prevState,
        height: window.innerHeight,
      }));
      fetchData(setState);
      fetchIndicators(setState);
      fetchTradeArrows(setState);
    }
  }, [state]);

  useEffect(() => {
    let filteredTradeArrows;
    if (direction == 2) {
      filteredTradeArrows = state.defaultTradeArrows;
    } else {
      filteredTradeArrows = state.defaultTradeArrows.filter((tradeArrow: any) => {
        return tradeArrow[0].direction == direction;
      });
    }
    setState((prevState: any) => ({
      ...prevState,
      tradeArrows: filteredTradeArrows,
      tradeArrowsDirection: direction,
    }));
  }, [direction]);

  if (state.height === 0) {
    return <div className="" />;
  }

  if (state.dates.length > 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="w-full px-2 pt-2 flex">
          <div className="mr-2">Selected Trades</div>
          <Radio.Group value={direction} onChange={(e) => setDirection(e.target.value)}>
            <Radio.Button value={2}>Both</Radio.Button>
            <Radio.Button value={1}>Long</Radio.Button>
            <Radio.Button value={0}>Short</Radio.Button>
          </Radio.Group>
        </div>
        <ReactECharts
          style={{ height: state.height, width: "100%" }}
          // option={generateOption(state)}
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
