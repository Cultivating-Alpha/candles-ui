import * as echarts from "echarts";

const generateOption = (state: any) => {
  const option = {
    title: {
      text: "Data Amount: " + echarts.format.addCommas(state.dates.length),
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
    },
    brush: {
      xAxisIndex: "all",
      brushLink: "all",
      outOfBrush: {
        colorAlpha: 0.1,
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false,
        },
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: "all",
        },
      ],
      label: {
        backgroundColor: "#777",
      },
    },
    grid: [
      {
        left: "5%",
        right: "5%",
        bottom: 300,
      },
      {
        left: "5%",
        right: "5%",
        height: 300,
        bottom: 0,
      },
    ],
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: state.dates,
        // inverse: true,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
      {
        type: "category",
        gridIndex: 1,
        boundaryGap: false,
        data: state.dates,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
    ],

    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
        },
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 99,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: "slider",
        bottom: 10,
        start: 10,
        end: 100,
      },
    ],
    series: [
      {
        name: "OHLC",
        type: "candlestick",
        data: state.candleData,
        markPoint: {
          label: {
            formatter: function (param) {
              return param != null ? Math.round(param.value) + "" : "";
            },
            fontSize: 8,
            distance: 350,
            show: false,
          },
          data: state.markData,
          symbol: "triangle",
          symbolSize: 12,
        },
      },
      {
        name: "Don",
        type: "line",
        itemStyle: {
          color: "gray",
        },
        data: state.indData,
        // encode: {
        //   x: 0,
        //   y: 6,
        // },
      },
      {
        type: "scatter",
        symbolSize: 10,
        data: state.scatterData,
      },
      {
        name: "Equity",
        type: "line",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: state.equityData,
        itemStyle: {
          color: "black",
        },
        large: true,
      },
    ],
  };
  return option
}

export default generateOption
