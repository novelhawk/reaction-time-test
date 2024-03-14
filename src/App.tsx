import type { Component } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { ReactionBox } from "./ReactionBox";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <ReactionBox />
    </div>
  );
};

export default App;
