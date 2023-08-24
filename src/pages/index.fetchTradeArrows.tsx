import axios from 'axios';
import { usePapaParse } from 'react-papaparse';

const fetchIndicators = (setState) => {
  const { readString } = usePapaParse();
  axios.get('/trade_arrows.json').then((res) => {
    console.log(res.data);
    setState((prevState) => ({
      ...prevState,
      tradeArrows: res.data,
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
