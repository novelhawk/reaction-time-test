import {
  type Component,
  createSignal,
  createEffect,
  on,
  type Setter,
} from "solid-js";
import StateIcon from "./StateIcon";

import styles from "./ReactionBox.module.css";
import type { InputMethod, Measurement } from "./Measurement.model";

export const statues = ["start", "active", "ready", "done", "error"] as const;
export type Status = (typeof statues)[number];

type Props = {
  setMeasurements: Setter<Measurement[]>;
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

export const ReactionBox: Component<Props> = (props: Props) => {
  const [status, setStatus] = createSignal<Status>("start");
  const [method, setMethod] = createSignal<InputMethod>("mousedown");
  const [score, setScore] = createSignal<number>(0);
  const [timer, setTimer] = createSignal<number>(-1);
  const advanceStatus = (e: Event) => {
    e.preventDefault();
    setMethod("mousedown");
    setStatus((prev) => nextStatus[prev]);
  };
  const keyboardAdvance = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const k = e.key;
    if (k.length === 1) {
      const c = k.charCodeAt(0) & ~0x20;
      if (c >= 65 && c <= 90) {
        e.preventDefault();
        setMethod("keydown");
        setStatus((prev) => nextStatus[prev]);
      }
    } else if (k === "Enter" || k === "Space") {
      e.preventDefault();
      setMethod("keydown");
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
      props.setMeasurements((prev) => [
        ...prev,
        {
          type: method(),
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
        <StateIcon class={styles.icon} status={status} />
        <span class={styles.description}>{desc()}</span>
      </div>
    </button>
  );
};
