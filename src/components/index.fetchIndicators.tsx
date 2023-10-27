import axios from 'axios';
import { usePapaParse } from 'react-papaparse';

const fetchIndicators = (setState: any) => {
  // eslint-disable-next-line
  const { readString } = usePapaParse();
  axios.get('/indicators.json').then((settings_res) => {
    const settings = settings_res.data;
    const series: any[] = [];
    axios.get('/indicators.csv').then((res) => {
      readString(res.data, {
        worker: true,
        dynamicTyping: true,
        complete: (results) => {
          settings.map((setting: any) => {
            return series.push({
              ...setting,
              data: results.data.map((arr: any) => arr[setting.dataIndex]),
              xAxisIndex: setting.panel,
              yAxisIndex: setting.panel,
            });
          });

          setState((prevState: any) => ({
            ...prevState,
            indicators: series,
          }));
        },
      });
    });
  });
};

export default fetchIndicators;
