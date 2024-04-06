import type { JSX } from "solid-js/jsx-runtime";

import styles from "./Statistics.module.css";
import LineGraph from "./LineGraph";
import type { Accessor, Setter } from "solid-js";
import type { Measurement } from "./Measurement.model";
import { DateTime } from "luxon";

type Props = {
  measurements: Accessor<Measurement[]>;
  setMeasurements: Setter<Measurement[]>;
};

export default function Statistics(props: Props): JSX.Element {
  const normalized = () => props.measurements();
  const today = () =>
    normalized().filter(
      (m) => DateTime.now().startOf("day").toJSDate() < new Date(m.timestamp)
    );

  return (
    <>
      <h1 class={styles.title}>Statistics</h1>
      <div class={styles.container}>
        <div class={styles.graph}>
          <LineGraph
            measurements={today}
            setMeasurements={props.setMeasurements}
          />
        </div>
      </div>
    </>
  );
}
