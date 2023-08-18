import axios from "axios";
import { usePapaParse } from "react-papaparse";
import * as echarts from "echarts";

const fetchIndicators = (setState) => {
  const { readString } = usePapaParse();
  axios
    .get("/indicators.json")
    .then((res) => {
      const settings = res.data
      const series = []
      axios
        .get("/indicators.csv")
        .then((res) => {
          readString(res.data, {
            worker: true,
            dynamicTyping: true,
            complete: (results) => {
               settings.map((setting) => {
                 series.push({
                   ...setting,
                   data: results.data.map(arr => arr[setting.dataIndex]),
                  xAxisIndex: setting.panel,
                  yAxisIndex: setting.panel,
                 })
               })

              setState(prevState => ({
                ...prevState,
                indicators: series,
              }));
            },
          })
        })

    })

}

export default fetchIndicators