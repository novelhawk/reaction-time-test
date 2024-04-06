import { Chart, type ChartTypeRegistry } from "chart.js/auto";
import "luxon";
import "chartjs-adapter-luxon";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { type Accessor, onMount, createEffect, type Setter } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import type { Measurement } from "./Measurement.model";

type Props = {
  timestamps: Accessor<number[]>;
  data: Accessor<number[]>;
  setMeasurements: Setter<Measurement[]>;
};

function createGraph(
  canvas: HTMLCanvasElement,
  props: Props
): Chart<keyof ChartTypeRegistry, number[], number> {
  return new Chart(canvas, {
    type: "line",
    plugins: [
      ChartDataLabels,
      {
        id: "doubleClickRemove",
        beforeEvent: (chart, { event, inChartArea }) => {
          if (event.type !== "dblclick" || !inChartArea || !event?.native) {
            return;
          }

          const elements = chart.getElementsAtEventForMode(
            event.native,
            "nearest",
            { intersect: true },
            false
          );

          const [element] = elements;
          if (element == null) {
            return;
          }

          const timestamp = chart.data.labels?.[element.index];
          if (timestamp == null) {
            return;
          }

          props.setMeasurements((measurements) => {
            const index = measurements.findIndex(
              (it) => it.timestamp === timestamp
            );
            if (index === -1) {
              return measurements;
            }
            return [
              ...measurements.slice(0, index),
              ...measurements.slice(index + 1),
            ];
          });
        },
      },
    ],
    options: {
      events: [
        "mousemove",
        "mouseout",
        "click",
        "touchstart",
        "touchmove",
        "dblclick",
      ],
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: true,
          color: "rgb(75, 192, 192)",
          anchor: "start",
          align: "top",
          formatter: (value: number) => Math.floor(value),
          offset: 6,
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
      labels: props.timestamps(),
      datasets: [
        {
          label: "Test",
          data: props.data(),
        },
      ],
    },
  });
}

export default function LineGraph(props: Props): JSX.Element {
  let canvas: HTMLCanvasElement | undefined;
  let graph: Chart<keyof ChartTypeRegistry, number[], number>;

  onMount(() => {
    if (canvas) {
      graph = createGraph(canvas, props);
    }
  });

  createEffect(() => {
    console.log(props.data());
    console.log(props.timestamps());
    graph.config.data.labels = props.timestamps();
    graph.config.data.datasets[0].data = props.data();
    graph.update();
  });

  return <canvas ref={canvas} />;
}
