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
  const advanceStatus = (e: Event) => {
    e.preventDefault();
    setStatus((prev) => nextStatus[prev]);
  };
  const keyboardAdvance = (e: KeyboardEvent) => {
    const k = e.key;
    if (k.length === 1) {
      const c = k.charCodeAt(0) & ~0x20;
      if (c >= 65 && c <= 90) {
        e.preventDefault();
        setStatus((prev) => nextStatus[prev]);
      }
    } else if (k === "Enter" || k === "Space") {
      e.preventDefault();
      setStatus((prev) => nextStatus[prev]);
    }
  };
  const statusClass = () => styles[`status-${status()}`];
  const disable = (e: Event) => e.preventDefault();

  const timeRenderer = Intl.NumberFormat(undefined, {
    style: "unit",
    unit: "millisecond",
    maximumFractionDigits: 0,
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
    <button
      type="button"
      class={`${styles.box} ${statusClass()}`}
      onMouseDown={advanceStatus}
      onKeyDown={keyboardAdvance}
      onContextMenu={disable}
      tabIndex={0}
      autofocus={true}
    >
      <div class={styles.content}>
        <StateIcon class="self-end text-white" status={status} />
        <span class={styles.description}>{desc()}</span>
      </div>
    </button>
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
