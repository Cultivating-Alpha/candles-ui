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
  equity: 7,
  entry_trade: 8,
  exit_trade: 9,
};

const addCandleItem = (item: any[]) => {
  let itemStyle = {
    color: "transparent", // Set the color for bullish (rising) candlesticks
    color0: "transparent", // Set the color for bearish (falling) candlesticks
    borderColor: "gray", // Set border color for candlesticks
    borderColor0: "gray", // Set border color for candlesticks
  };

  if (item[keys["entry_trade"]] != "nan") {
    itemStyle = {
      color: "black",
      color0: "black",
      borderColor: "black",
      borderColor0: "blackred",
    };
  } else if (item[keys["exit_trade"]] != "nan") {
    itemStyle = {
      color: "orange",
      color0: "orange",
      borderColor: "orange",
      borderColor0: "orange",
    };
  } else if (item[keys["long"]] == "True") {
    itemStyle = {
      color: "rgba(0, 128, 128, 0.5)",
      color0: "rgba(255, 0, 0, 0.5)",
      borderColor: "rgba(0, 128, 128, 0.5)",
      borderColor0: "rgba(255, 0, 0, 0.5)",
    };
  } else if (item[keys["short"]] == "True") {
    itemStyle = {
      color: "rgba(255, 0, 0, 0.5)",
      color0: "red",
      borderColor: "rgba(255, 0, 0, 0.5)",
      borderColor0: "rgba(255, 0, 0, 0.5)",
    };
  }
  return {
    value: [
      item[keys["open"]],
      item[keys["close"]],
      item[keys["low"]],
      item[keys["high"]],
    ],
    itemStyle: itemStyle,
  };
};

const fetchData = (setState) => {
  const { readString } = usePapaParse();
  axios
    .get("/ohlc.csv")
    .then((res) =>
      readString(res.data, {
        worker: true,
        dynamicTyping: true,
        complete: (results) => {
          const _candleData: any[] = [];
          const _dates: any[] = [];
          const _equityData: any[] = [];
          const _markData: any[] = [];
          const _scatterData: any[] = [];
          results.data.map((item: any[], index) => {
            let xValue = +new Date(item[keys["date"]]);
            let date = echarts.format.formatTime("yyyy-MM-dd hh:mm:ss", xValue);
            _dates.push(date);
            _candleData.push(addCandleItem(item));
          });
          console.log(results.data[0]);
          setState((prevState) => ({
            ...prevState,
            dates: _dates,
            candleData: _candleData,
          }));
        },
      }),
    )
    .catch((err) => {});
};

export default fetchData;
