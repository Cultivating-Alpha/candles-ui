import axios from "axios";
import { usePapaParse } from "react-papaparse";
import * as echarts from "echarts";

const keys = {
  date: 0,
  open: 1,
  high: 2,
  low: 3,
  close: 4,
  long: 5,
  short: 6,
  equity: 7

}

const addCandleItem = (item: any[]) => {
  let itemStyle = {
    color: "transparent", // Set the color for bullish (rising) candlesticks
    color0: "transparent", // Set the color for bearish (falling) candlesticks
    borderColor: "gray", // Set border color for candlesticks
    borderColor0: "gray", // Set border color for candlesticks
  };

  if (item[keys['long']] == "True") {
    itemStyle = {
      color: "teal",
      color0: "red",
      borderColor: "teal",
      borderColor0: "red",
    };
  } else if (item[keys['short']] == "True") {
    itemStyle = {
      color: "red",
      color0: "red",
      borderColor: "red",
      borderColor0: "red",
    };
  }
  return {
    value: [
      item[keys['open']], 
      item[keys['close']],
      item[keys['low']],
      item[keys['high']]
    ],
    itemStyle: itemStyle,
  };
}

const fetchData = (setState) => {
  const { readString } = usePapaParse();
  axios
    .get("/ohlc.csv")
    .then((res) =>
      readString(res.data, {
        worker: true,
        dynamicTyping: true,
        complete: (results) => {
          const _candleData: any[]= [];
          const _dates: any[]= [];
          const _equityData: any[]= [];
          const _markData: any[]= [];
          const _scatterData: any[]= [];
          results.data.map((item: any[]) => {
            let xValue = +new Date(item[keys['date']]);
            let minute = 60 * 1000;
            let date = echarts.format.formatTime("yyyy-MM-dd hh:mm:ss", (xValue += minute));
            _dates.push(date);
            _equityData.push(item[keys['equity']]);

            _candleData.push(addCandleItem(item));

            // if (item[10] > 0) {
            //   _markData.push({
            //     name: "Mark",
            //     coord: [date, item[2] + 2],
            //     value: item[10],
            //     itemStyle: {
            //       color: "rgb(41,60,85)",
            //     },
            //   });
            // }
            // if (item[11] > 70) {
            //   _scatterData.push([date, item[2] + 5]);
            // }
            // if (item[11] < 30) {
            //   _scatterData.push([date, item[3] - 5]);
            // }

          });
          setState(prevState => ({
            ...prevState,
            equityData: _equityData,
            dates: _dates,
            candleData: _candleData,
            markData: _markData,
            scatterData: _scatterData
          }));
        },
      })
    )
    .catch((err) => {});

}

export default fetchData
