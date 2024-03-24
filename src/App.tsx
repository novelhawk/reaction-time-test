import { createEffect, type Component, createSignal } from "solid-js";

import { ReactionBox } from "./ReactionBox";
import Statistics from "./Statistics";
import type { Measurement } from "./Measurement.model";

const App: Component = () => {
  const [measurements, setMeasurements] = createSignal<Measurement[]>(
    loadMeasurements()
  );

  createEffect(() => {
    saveMeasurements(measurements());
  });

  return (
    <div class="h-screen hidescroll overflow-y-auto">
      <ReactionBox setMeasurements={setMeasurements} />
      <Statistics measurements={measurements} />
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

export default App;
