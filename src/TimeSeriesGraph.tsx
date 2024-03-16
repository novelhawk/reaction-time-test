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
      scales: {
        x: {
          type: "time",
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
