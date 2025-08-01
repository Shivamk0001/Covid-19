import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import numeral from "numeral";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem) {
          return numeral(tooltipItem.raw.y).format("+0,0");
        },
      },
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "month",
        tooltipFormat: "MMM yyyy",
        displayFormats: {
          month: "MMM yyyy",
        },
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 24,
      },
    },
    y: {
      ticks: {
        callback: function (value) {
          return numeral(value).format("0a");
        },
      },
      grid: {
        display: false,
      },
    },
  },
};


const parseDate = (dateStr) => {
  const [month, day, year] = dateStr.split("/");
  return new Date(`20${year}`, month - 1, day);
};

const buildChartData = (data, casesType = "cases") => {
  const chartData = [];
  let lastDataPoint;

  if (!data[casesType]) return [];

  for (let date in data[casesType]) {
    const parsedDate = parseDate(date);
    if (parsedDate >= new Date("2020-01-01") && parsedDate <= new Date("2023-12-31")) {
      if (lastDataPoint !== undefined) {
        chartData.push({
          x: parsedDate,
          y: data[casesType][date] - lastDataPoint,
        });
      }
      lastDataPoint = data[casesType][date];
    } else {
      lastDataPoint = data[casesType][date]; 
    }
  }

  return chartData;
};

function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=all");
        const result = await res.json();
        const chartData = buildChartData(result, casesType);
        setData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [casesType]);

  return (

    <div className={props.className}
    
    style={{ height: "320px" }}>
      {data.length > 0 ? (
        <Line
          data={{
            datasets: [
              {
                label: `COVID-19 ${casesType}`,
                data: data,
                borderColor: "#CC1034",
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                fill: true,
              },
            ],
          }}
          options={options}
        />
      ) : (
        <p>Loading or no data available</p>
      )}
    </div>
  );
}

export default LineGraph;
