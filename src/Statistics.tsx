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
  const last20 = () => props.measurements().slice(-20);

  return (
    <>
      <h1 class={styles.title}>Last 20 scores</h1>
      <div class={styles.container}>
        <div class={styles.graph}>
          <LineGraph
            measurements={last20}
            setMeasurements={props.setMeasurements}
          />
        </div>
      </div>
    </>
  );
}
