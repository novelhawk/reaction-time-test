import { type Component, createSignal, createEffect, on } from "solid-js";
import StateIcon from "./StateIcon";

import styles from "./ReactionBox.module.css";

export const statues = ["start", "active", "ready", "done", "error"] as const;
export type Status = (typeof statues)[number];

type Measurement = {
  type: "mousedown" | "keydown";
  which: "left";
  wait: number;
  delay: number;
  timestamp: number;
};

const nextStatus: Record<Status, Status> = {
  start: "active",
  active: "error",
  ready: "done",
  done: "active",
  error: "active",
};

const descriptions: Partial<Record<Status, string>> = {
  start: "Reaction Time Test",
  active: "Wait for green",
  ready: "Click!",
  error: "You clicked too early!",
};

export const ReactionBox: Component = () => {
  const [status, setStatus] = createSignal<Status>("start");
  const [score, setScore] = createSignal<number>(0);
  const [timer, setTimer] = createSignal<number>(-1);
  const [measurements, setMeasurements] = createSignal<Measurement[]>(
    loadMeasurements()
  );
  const advanceStatus = () => setStatus((prev) => nextStatus[prev]);
  const statusClass = () => styles[`status-${status()}`];

  const timeRenderer = Intl.NumberFormat(undefined, {
    style: "unit",
    unit: "millisecond",
    maximumFractionDigits: 2,
  });

  const desc = () =>
    status() !== "done" ? descriptions[status()] : timeRenderer.format(score());

  const callbacks: Partial<Record<Status, () => void>> = {
    active: () => {
      const wait = Math.random() * 3000 + 1500;
      const timer = setTimeout(() => setStatus("ready"), wait);
      performance.mark("initial");
      setTimer(timer);
    },
    ready: () => performance.mark("ready"),
    done: () => {
      performance.mark("done");

      const wait = performance.measure("wait", "initial", "ready");
      const measure = performance.measure("delay", "ready", "done");
      setScore(measure.duration);
      setMeasurements((prev) => [
        ...prev,
        {
          type: "mousedown",
          which: "left",
          wait: wait.duration,
          delay: measure.duration,
          timestamp: Date.now(),
        },
      ]);
    },
  };

  createEffect(
    on(status, () => {
      clearTimeout(timer());
      callbacks[status()]?.();
    })
  );

  createEffect(() => {
    saveMeasurements(measurements());
  });

  return (
    <div
      class={`${styles.box} ${statusClass()}`}
      onMouseDown={advanceStatus}
      onKeyDown={advanceStatus}
    >
      <div class={styles.content}>
        <StateIcon class={styles.icon} status={status} />
        <span class={styles.description}>{desc()}</span>
      </div>
    </div>
  );
};

function loadMeasurements(): Measurement[] {
  const data = window.localStorage.getItem("measurements");
  if (data == null) {
    return [];
  }

  const items: unknown = JSON.parse(data);
  if (!Array.isArray(items)) {
    return [];
  }

  return items;
}

function saveMeasurements(measurements: Measurement[]): void {
  window.localStorage.setItem("measurements", JSON.stringify(measurements));
}
