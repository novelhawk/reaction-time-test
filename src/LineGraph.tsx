import { Chart } from "chart.js/auto";
import "luxon";
import "chartjs-adapter-luxon";
import { onMount } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { weekDays } from "./utils/date";

type Props = {
  timestamps: number[];
  data: number[];
};

function createGraph(canvas: HTMLCanvasElement, props: Props) {
  new Chart(canvas, {
    type: "line",
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        line: {
          borderColor: "rgb(75, 192, 192)",
          tension: 0.2,
        },
        point: {
          radius: 4,
          backgroundColor: "rgb(75, 192, 192)",
        },
      },
      scales: {
        x: {
          type: "timeseries",
          time: {
            unit: "minute",
          },
          grid: {
            display: false,
          },
        },
        y: {
          border: {
            display: false,
          },
          grid: {
            color: "#888",
          },
        },
      },
      maintainAspectRatio: false,
    },
    data: {
      labels: props.timestamps,
      datasets: [
        {
          label: "Test",
          data: props.data,
        },
      ],
    },
  });
}

export default function LineGraph(props: Props): JSX.Element {
  let canvas: HTMLCanvasElement | undefined;

  onMount(() => {
    if (canvas) {
      createGraph(canvas, props);
    }
  });

  return <canvas ref={canvas} />;
}
