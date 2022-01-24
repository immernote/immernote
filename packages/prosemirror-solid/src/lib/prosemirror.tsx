import { onMount, onCleanup, createEffect } from "solid-js";
import type { Store } from "solid-js/store";
import { EditorView, EditorProps } from "prosemirror-view";
import type { EditorState } from "prosemirror-state";
import applyDevTools from "prosemirror-dev-tools";

interface PropsBase extends EditorProps {
	state: Store<EditorState>;
	onStateChange: (state: EditorState) => void;
	onDocChange: (doc: any) => void;
	onDeleteBlock: () => void;
	onInsertBlocks: (blocks: any[]) => void;
}

type Props = PropsBase;

export function ProseMirror(props: Props) {
	let viewRef: EditorView;
	let root: HTMLDivElement | undefined;

	onMount(() => {
		viewRef = new EditorView(root, {
			state: props.state,
			handleKeyDown(view, event) {
				if (
					event.key === "Backspace" &&
					!view.composing &&
					(view.state.doc.childCount === 0 || view.state.doc.firstChild?.childCount === 0)
				) {
					props.onDeleteBlock();
					return true;
				}

				return false;
			},
			dispatchTransaction(transaction) {
				let newState = viewRef.state.apply(transaction);
				let blocks: any[] | undefined;
				if (newState.doc.childCount > 1) {
					blocks = (newState.doc.content.toJSON() as any[]).slice(1);

					const tr = newState.tr.deleteRange(newState.doc.firstChild!.nodeSize, newState.doc.content.size);

					newState = newState.apply(tr);
				}
				viewRef.updateState(newState);
				props.onStateChange(newState);
				transaction.docChanged && props.onDocChange(newState.toJSON().doc);
				if (blocks) {
					props.onInsertBlocks(blocks);
				}
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
