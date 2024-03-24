import type { JSX } from "solid-js/jsx-runtime";

import styles from "./Statistics.module.css";
import LineGraph from "./LineGraph";
import type { Accessor } from "solid-js";
import type { Measurement } from "./Measurement.model";
import { DateTime } from "luxon";

type Props = {
  measurements: Accessor<Measurement[]>;
};

export default function Statistics(props: Props): JSX.Element {
  const normalized = () =>
    props.measurements().filter((it) => it.delay < 1000 && it.delay > 100);
  const today = () =>
    normalized().filter(
      (m) => DateTime.now().startOf("day").toJSDate() < new Date(m.timestamp)
    );
  const timestamps = () => today().map((m) => m.timestamp);
  const data = () => today().map((m) => m.delay);

  return (
    <>
      <h1 class={styles.title}>Statistics</h1>
      <div class={styles.container}>
        <div class={styles.graph}>
          <LineGraph data={data()} timestamps={timestamps()} />
        </div>
      </div>
    </>
  );
}
