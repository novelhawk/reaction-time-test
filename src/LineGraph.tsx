import { Chart, type ChartTypeRegistry } from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'luxon';
import { type Accessor, createEffect, onMount, type Setter } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import type { Measurement } from './Measurement.model';

type MeasurementChart = Chart<keyof ChartTypeRegistry, Measurement[], number>;

type Props = {
  measurements: Accessor<Measurement[]>;
  setMeasurements: Setter<Measurement[]>;
};

function createGraph(
  canvas: HTMLCanvasElement,
  props: Props,
): MeasurementChart {
  return new Chart(canvas, {
    type: 'line',
    plugins: [
      ChartDataLabels,
      {
        id: 'doubleClickRemove',
        beforeEvent: (chart, { event, inChartArea }) => {
          if (event.type !== 'dblclick' || !inChartArea || !event?.native) {
            return;
          }

          const elements = chart.getElementsAtEventForMode(
            event.native,
            'nearest',
            { intersect: true },
            false,
          );

          const [element] = elements;
          if (element == null) {
            return;
          }

          const measurement = chart.data.datasets[element.datasetIndex].data[
            element.index
          ] as unknown as Measurement;
          if (measurement == null) {
            return;
          }

          props.setMeasurements((measurements) => {
            const index = measurements.indexOf(measurement);
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
        'mousemove',
        'mouseout',
        'click',
        'touchstart',
        'touchmove',
        'dblclick',
      ],
      parsing: {
        xAxisKey: 'timestamp',
        yAxisKey: 'delay',
      },
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          display: true,
          color: 'rgb(75, 192, 192)',
          anchor: 'start',
          align: 'top',
          formatter: (_value: number, { dataset, dataIndex }) => {
            const measurement = dataset.data[
              dataIndex
            ] as unknown as Measurement;
            return Math.floor(measurement.delay);
          },
          offset: 6,
        },
      },
      elements: {
        line: {
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.2,
        },
        point: {
          radius: 4,
          backgroundColor: 'rgb(75, 192, 192)',
        },
      },
      scales: {
        x: {
          type: 'timeseries',
          time: {
            unit: 'minute',
          },
          grid: {
            display: false,
          },
        },
        y: {
          grace: 1,
          border: {
            display: false,
          },
          grid: {
            color: '#888',
          },
        },
      },
      maintainAspectRatio: false,
    },
    data: {
      datasets: [
        {
          label: 'Test',
          data: props.measurements(),
        },
      ],
    },
  });
}

export default function LineGraph(props: Props): JSX.Element {
  let canvas: HTMLCanvasElement | undefined;
  let graph: MeasurementChart;

  onMount(() => {
    if (canvas) {
      graph = createGraph(canvas, props);
    }
  });

  createEffect(() => {
    graph.config.data.datasets[0].data = props.measurements();
    graph.update();
  });

  return <canvas ref={canvas} />;
}
