import type { Component } from "solid-js";

import styles from "./App.module.css";
import { ProseMirror } from "./lib/prosemirror/prosemirror";

let ct = ` {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Maker of things"}]}]}`;

const p = JSON.parse(ct);

const App: Component = () => {
	const [state, setState] = useMultiline(p);
	return (
		<div class={styles.App}>
			<ProseMirror state={state} onStateChange={setState} onDocChange={console.log} />
		</div>
	);
};

export default App;
