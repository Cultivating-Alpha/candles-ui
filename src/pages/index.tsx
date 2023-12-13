import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });
import * as echarts from "echarts/core";
import fetchData from "@/components/index.fetchData";
import fetchIndicators from "@/components/index.fetchIndicators";
import fetchTradeArrows from "@/components/index.fetchTradeArrows";
import generateOption from "@/components/index.generateOption";

import themes from "@/themes/themes";

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

  if (state.height === 0) {
    return <div className="" />;
  }
  if (typeof window !== "undefined") {
    if (state.dates.length > 0) {
      Object.keys(themes as any).forEach((key) => {
        echarts.registerTheme(key, themes[key]);
      });

      return (
        <div className="min-h-screen">
          <ReactECharts style={{ height: state.height, width: "100%" }} option={generateOption(state)} theme={"vintage"} notMerge lazyUpdate />
        </div>
      );
    }
  }

  return <div className="" />;
};

export default Index;
