import { baseKeymap } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";

import { useProseMirror } from "./use-prosemirror";
import { createInputRules } from "./create-input-rules";
import { prose } from "./schema";

export function useTextBlock(source: any) {
	return useProseMirror({
		doc: prose.nodeFromJSON(source),
		schema: prose,
		plugins: [createInputRules(prose), keymap(baseKeymap), dropCursor(), gapCursor()],
	});
}
