import { EditorState } from "prosemirror-state";
import { createStore } from "solid-js/store";

type Config = Parameters<typeof EditorState.create>[0];

export function useProseMirror(config: Config) {
	return createStore(EditorState.create(config));
}
