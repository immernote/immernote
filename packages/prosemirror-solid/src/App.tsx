import type { Component } from "solid-js";

import { ProseMirror } from "./lib/prosemirror";
import { useProseMirror } from "./lib/use-prosemirror";
import { schema } from "prosemirror-schema-basic";
// @ts-ignore
import { exampleSetup } from "prosemirror-example-setup";

let ct = ` {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Maker of things"}]}]}`;

const p = JSON.parse(ct);

const App: Component = () => {
	const [state, setState] = useProseMirror({
		doc: schema.nodeFromJSON(p),
		schema,
		plugins: exampleSetup({ schema }),
	});
	return (
		<main>
			<ProseMirror state={state} onStateChange={setState} onDocChange={console.log} />
			<pre>
				<code>{JSON.stringify(state)}</code>
			</pre>
		</main>
	);
};

export default App;
