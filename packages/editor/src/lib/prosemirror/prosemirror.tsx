import { onMount, onCleanup, createEffect } from "solid-js";
import type { Store } from "solid-js/store";
import { EditorView, EditorProps } from "prosemirror-view";
import type { EditorState } from "prosemirror-state";
import applyDevTools from "prosemirror-dev-tools";

interface PropsBase extends EditorProps {
	state: Store<EditorState>;
	onStateChange: (state: EditorState) => void;
	onDocChange: (doc: any) => void;
}

type Props = PropsBase;

export function ProseMirror(props: Props) {
	let viewRef: EditorView;
	let root: HTMLDivElement | undefined;

	onMount(() => {
		viewRef = new EditorView(root, {
			state: props.state,
			dispatchTransaction(transaction) {
				const newState = viewRef.state.apply(transaction);
				viewRef.updateState(newState);
				// console.log(
				// 	"TRANSACTION:\t",
				// 	JSON.stringify(transaction.steps, null, 2)
				// )
				// console.log("CONTENT:\t", JSON.stringify(newState.doc.content, null, 2))
				// console.log("STATE:\t", JSON.stringify(newState.toJSON().doc))
				// console.log("CHANGED?:\t", transaction.docChanged)
				props.onStateChange(newState);
				transaction.docChanged && props.onDocChange(newState.toJSON().doc);
				// do something here such as eventBus.dispatch('NEW-TRANSACTIION', transaction)
			},
		});

		applyDevTools(viewRef);
	});

	onCleanup(() => {
		viewRef.destroy();
	});

	createEffect(() => {
		if (props.state) {
			console.log("state.updated");
		}
	});

	return <div className="editooor" ref={root} />;
}
