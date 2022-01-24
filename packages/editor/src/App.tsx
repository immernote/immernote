import type { Component } from "solid-js";

import { ProseMirror } from "./lib/prosemirror";
import { useTextBlock } from "./lib/use-text-block";

let ct = ` {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Maker of things"}]}]}`;

const p = JSON.parse(ct);

const App: Component = () => {
	const [state, setState] = useTextBlock(p);
	return (
		<main>
			<ProseMirror
				state={state}
				onStateChange={setState}
				onDocChange={console.log}
				onDeleteBlock={() => {
					console.log("DELETE THIS BLOCK");
				}}
				onInsertBlocks={(blocks) => {
					console.log("INSERTS THESE BLOCKS", blocks);
				}}
				onArrowDown={() => {}}
				onArrowUp={() => {}}
				isFirst={false}
				isLast={false}
			/>
			<pre>
				<code>{JSON.stringify(state, null, 2)}</code>
			</pre>
		</main>
	);
};

export default App;
