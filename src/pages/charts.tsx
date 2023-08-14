import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react"; // or var ReactECharts = require('echarts-for-react');
import { usePapaParse } from "react-papaparse";

import * as echarts from "echarts";
import axios from "axios";

const upColor = "#ec0000";
const upBorderColor = "#8A0000";
const downColor = "#00da3c";
const downBorderColor = "#008F28";

// const dataCount = 2e5;
const dataCount = 200;
const data = [];
// const data = generateOHLC(dataCount);
// function generateOHLC(count) {
//   let data = [];
//   let xValue = +new Date(2011, 0, 1);
//   let minute = 60 * 1000;
//   let baseValue = Math.random() * 12000;
//   let boxVals = new Array(4);
//   let dayRange = 12;
//   for (let i = 0; i < count; i++) {
//     baseValue = baseValue + Math.random() * 20 - 10;
//     for (let j = 0; j < 4; j++) {
//       boxVals[j] = (Math.random() - 0.5) * dayRange + baseValue;
//     }
//     boxVals.sort();
//     let openIdx = Math.round(Math.random() * 3);
//     let closeIdx = Math.round(Math.random() * 2);
//     if (closeIdx === openIdx) {
//       closeIdx++;
//     }
//     let volumn = boxVals[3] * (1000 + Math.random() * 500);
//     // ['open', 'close', 'lowest', 'highest', 'volumn']
//     // [1, 4, 3, 2]
//     data[i] = [
//       echarts.format.formatTime("yyyy-MM-dd hh:mm:ss", (xValue += minute)),
//       +boxVals[openIdx].toFixed(2),
//       +boxVals[3].toFixed(2),
//       +boxVals[0].toFixed(2),
//       +boxVals[closeIdx].toFixed(2),
//       +volumn.toFixed(0),
//       getSign(data, i, +boxVals[openIdx], +boxVals[closeIdx], 4), // sign
//     ];
//   }
//   return data;
//   function getSign(data, dataIndex, openVal, closeVal, closeDimIdx) {
//     var sign;
//     if (openVal > closeVal) {
//       sign = -1;
//     } else if (openVal < closeVal) {
//       sign = 1;
//     } else {
//       sign =
//         dataIndex > 0
//           ? // If close === open, compare with close of last record
//             ? 1
//             data[dataIndex - 1][closeDimIdx] <= closeVal
//             : -1
//           : // No record of previous, set to be positive
//             1;
//     }
//     return sign;
//   }
// }

export default () => {
  const [height, setHeight] = useState(0);
  const [equityData, setEquityData] = useState();
  const [indData, setIndData] = useState([]);
  const [dates, setDates] = useState([]);
  const [candleData, setCandleData] = useState(0);
  const [markData, setMarkData] = useState(0);
  const [scatterData, setScatterData] = useState(0);
  const { readString } = usePapaParse();

  useEffect(() => {
    if (height === 0) {
      setHeight(window.innerHeight - 50);
    }
    axios
      .get("/ohlc.csv")
      .then((res) =>
        readString(res.data, {
          worker: true,
          dynamicTyping: true,
          complete: (results) => {
            const _source = [];
            const _candleData = [];
            const _indData = [];
            const _dates = [];
            const _equityData = [];
            const _markData = [];
            const _scatterData = [];
            results.data.map((item) => {
              let xValue = +new Date(item[0]);
              let minute = 60 * 1000;
              let date = echarts.format.formatTime("yyyy-MM-dd hh:mm:ss", (xValue += minute));
              _dates.push(date);
              _equityData.push(item[5]);
              _indData.push(item[6]);

              let itemStyle = {
                color: "transparent", // Set the color for bullish (rising) candlesticks
                color0: "transparent", // Set the color for bearish (falling) candlesticks
                borderColor: "gray", // Set border color for candlesticks
                borderColor0: "gray", // Set border color for candlesticks
              };
              if (item[7] == "True") {
                itemStyle = {
                  color: "teal",
                  color0: "red",
                  borderColor: "teal",
                  borderColor0: "red",
                };
              } else if (item[8] == "True") {
                itemStyle = {
                  color: "red",
                  color0: "red",
                  borderColor: "red",
                  borderColor0: "red",
                };
              }
              _candleData.push({
                value: [item[1], item[4], item[3], item[2]],
                itemStyle: itemStyle,
              });
              if (item[10] > 0) {
                _markData.push({
                  name: "Mark",
                  coord: [date, item[2] + 2],
                  value: item[10],
                  itemStyle: {
                    color: "rgb(41,60,85)",
                  },
                });
              }
              if (item[11] > 70) {
                _scatterData.push([date, item[2] + 5]);
              }
              if (item[11] < 30) {
                _scatterData.push([date, item[3] - 5]);
              }

              // if (item[7] == "False") {
              //   _candleData.push({
              //     value: [item[1], item[2], item[3], item[4]],
              //     itemStyle: {
              //       shadowColor: "rgba(0, 0, 0, 0.5)",
              //       shadowBlur: 10,
              //     },
              //
              //     // itemStyle: {
              //     //   color: "green", // Set the color for bullish (rising) candlesticks
              //     //   color0: "red", // Set the color for bearish (falling) candlesticks
              //     // },
              //   });
              // } else {
              //   _candleData.push({
              //     value: [item[1], item[2], item[3], item[4]],
              //     // itemStyle: {
              //     //   color: "green", // Set the color for bullish (rising) candlesticks
              //     //   color0: "red", // Set the color for bearish (falling) candlesticks
              //     // },
              //   });
              // }
            });
            setEquityData(_equityData);
            setCandleData(_candleData);
            setDates(_dates);
            setIndData(_indData);
            setMarkData(_markData);
            setScatterData(_scatterData);
          },
        })
      )
      .catch((err) => {});
    // const response = await axios.get("/output.csv", { responseType: "blob" });
    // const file = response.data;
    // console.log(file)
  }, [height]);

  if (height === 0) {
    return <div className=""></div>;
  }

  const option = {
    title: {
      text: "Data Amount: " + echarts.format.addCommas(dataCount),
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
        data: dates,
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
        data: dates,
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
        data: candleData,
        markPoint: {
          label: {
            formatter: function (param) {
              return param != null ? Math.round(param.value) + "" : "";
            },
            fontSize: 8,
            distance: 350,
            show: false,
          },
          data: markData,
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
        data: indData,
        // encode: {
        //   x: 0,
        //   y: 6,
        // },
      },
      {
        type: "scatter",
        symbolSize: 10,
        data: scatterData,
      },
      {
        name: "Equity",
        type: "line",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: equityData,
        itemStyle: {
          color: "black",
        },
        large: true,
      },
    ],
  };
  if (dates.length > 0) {
    // option.dataset.source = source;
    // console.log(data.length);
    // console.log("=========");
    // option.series[0].data = candleData;
    // console.log(option.series[0]);
    // console.log(option.series[0]);
    // console.log(option.series[0].data[0]);
    // console.log(source);

    return (
      <div className="min-h-screen">
        <ReactECharts style={{ height: height, width: "100%" }} option={option} notMerge={true} lazyUpdate={true} theme={"theme_name"} />
      </div>
    );
  }
};
