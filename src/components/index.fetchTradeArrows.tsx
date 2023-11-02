import axios from "axios";

const fetchIndicators = (setState: any) => {
  // const { readString } = usePapaParse();
  axios.get("/trade_arrows.json").then((res) => {
    setState((prevState: any) => ({
      ...prevState,
      tradeArrows: res.data,
      defaultTradeArrows: res.data,
      tradeArrowsDirection: 2,
    }));
    // axios.get('/indicators.csv').then((res) => {
    //   readString(res.data, {
    //     worker: true,
    //     dynamicTyping: true,
    //     complete: (results) => {
    //       settings.map((setting) => {
    //         console.log('====================');
    //         console.log(setting);
    //         series.push({
    //           ...setting,
    //           data: results.data.map((arr) => arr[setting.dataIndex]),
    //           xAxisIndex: setting.panel,
    //           yAxisIndex: setting.panel,
    //         });
    //       });
    //
    //       setState((prevState) => ({
    //         ...prevState,
    //         indicators: series,
    //       }));
    //     },
    //   });
    // });
  });
};

export default fetchIndicators;
