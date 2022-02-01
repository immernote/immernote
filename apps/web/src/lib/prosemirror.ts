import {
  baseKeymap,
  chainCommands,
  exitCode,
  joinDown,
  joinUp,
  lift,
  selectParentNode,
  setBlockType,
  toggleMark,
  wrapIn,
} from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { redo, undo } from "prosemirror-history";
import {
  ellipsis,
  emDash,
  InputRule,
  inputRules,
  smartQuotes,
  undoInputRule,
} from "prosemirror-inputrules";
import { keymap } from "prosemirror-keymap";
import { MarkType, Schema } from "prosemirror-model";
import { liftListItem, sinkListItem, wrapInList } from "prosemirror-schema-list";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorProps, EditorView } from "prosemirror-view";
import { createElement, useEffect, useRef, useState } from "react";

interface ProseMirrorProps extends EditorProps {
  state: EditorState;
  on_state_change: (state: EditorState) => void;
  on_doc_change: (doc: any) => void;
  on_delete_block: () => void;
  on_insert_blocks: (blocks: any[]) => void;
  on_arrow_up: (pos: number) => void;
  on_arrow_down: (pos: number) => void;
  is_first: boolean;
  is_last: boolean;
}

export function ProseMirror(props: ProseMirrorProps) {
  const viewRef = useRef<EditorView>();
  const root = useRef<HTMLDivElement>();

  let isArrowDown = false;
  let isArrowUp = false;

  useEffect(() => {
    viewRef.current = new EditorView(root.current, {
      state: props.state,
      handleKeyDown(view, event) {
        isArrowDown = !view.composing && event.key === "ArrowDown";
        isArrowUp = !view.composing && event.key === "ArrowUp";

        if (
          event.key === "Backspace" &&
          !view.composing &&
          (view.state.doc.childCount === 0 || view.state.doc.firstChild?.childCount === 0)
        ) {
          props.on_delete_block();
          return true;
        }

        return false;
      },
      dispatchTransaction(transaction) {
        // @ts-ignore
        const isPointer = !!(transaction["meta"] as { [key: string]: boolean })["pointer"];

        if (
          !props.is_last &&
          isArrowDown &&
          !isPointer &&
          transaction.selection.empty &&
          transaction.selection.$to.pos === transaction.selection.$to.end()
        ) {
          props.on_arrow_down(viewRef.current.state.selection.anchor);
          return;
        }

        if (
          !props.is_first &&
          isArrowUp &&
          !isPointer &&
          transaction.selection.empty &&
          transaction.selection.$from.pos === transaction.selection.$from.start()
        ) {
          props.on_arrow_up(viewRef.current.state.selection.anchor);
          return;
        }

        let newState = viewRef.current.state.apply(transaction);
        let blocks: any[] | undefined;
        if (newState.doc.childCount > 1) {
          blocks = (newState.doc.content.toJSON() as any[]).slice(1);

          const tr = newState.tr.deleteRange(
            newState.doc.firstChild!.nodeSize,
            newState.doc.content.size
          );

          newState = newState.apply(tr);
        }
        viewRef.current?.updateState(newState);
        props.on_state_change(newState);
        transaction.docChanged && props.on_doc_change(newState.toJSON().doc);
        if (blocks) {
          props.on_insert_blocks(blocks);
        }
      },
    });

    return () => {
      viewRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (props.state) {
      console.log("state.updated");
    }
  }, [props.state]);

  return createElement("div", { ref: root });
}

/* ---------------------------------------------------------------------------------------------- */

type Config = Parameters<typeof EditorState.create>[0];

export function useProseMirror(config: Config) {
  return useState(() => EditorState.create(config));
}

export function useTextBlock(source: any) {
  return useProseMirror({
    doc: prose.nodeFromJSON(source),
    schema: prose,
    plugins: [
      createInputRules(prose),
      keymap(createKeymap(prose)),
      keymap(baseKeymap),
      dropCursor(),
      gapCursor(),
    ],
  });
}

/* ---------------------------------------------------------------------------------------------- */

export const prose = new Schema({
  nodes: {
    // :: NodeSpec The top level document node.
    doc: {
      content: "block+",
    },

    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() {
        return ["p", 0];
      },
    },

    // :: NodeSpec A code listing. Disallows marks or non-text inline
    // nodes by default. Represented as a `<pre>` element with a
    // `<code>` element inside of it.
    code_block: {
      content: "text*",
      marks: "",
      group: "block",
      code: true,
      defining: true,
      parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
      toDOM() {
        return ["pre", ["code", 0]];
      },
    },

    // :: NodeSpec The text node.
    text: {
      group: "inline",
    },

    // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
    hard_break: {
      inline: true,
      group: "inline",
      selectable: false,
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return ["br"];
      },
    },
  },

  marks: {
    // :: MarkSpec A link. Has `href` and `title` attributes. `title`
    // defaults to the empty string. Rendered and parsed as an `<a>`
    // element.
    link: {
      attrs: {
        href: {},
        title: { default: null },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: "a[href]",
          // @ts-ignore
          getAttrs(dom: HTMLLinkElement) {
            return {
              href: dom.getAttribute("href"),
              title: dom.getAttribute("title"),
            };
          },
        },
      ],
      toDOM(node) {
        let { href, title } = node.attrs;
        return ["a", { href, title }, 0];
      },
    },

    // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
    // Has parse rules that also match `<i>` and `font-style: italic`.
    em: {
      parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
      toDOM() {
        return ["em", 0];
      },
    },

    // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
    // also match `<b>` and `font-weight: bold`.
    strong: {
      parseDOM: [
        { tag: "strong" },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        {
          tag: "b",
          // @ts-ignore
          getAttrs: (node: HTMLElement) => node.style.fontWeight != "normal" && null,
        },
        {
          style: "font-weight",
          // @ts-ignore
          getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
        },
      ],
      toDOM() {
        return ["strong", 0];
      },
    },

    // :: MarkSpec Code font mark. Represented as a `<code>` element.
    code: {
      parseDOM: [{ tag: "code" }],
      toDOM() {
        return ["code", 0];
      },
    },
  },
});

/* ---------------------------------------------------------------------------------------------- */

export function createInputRules(schema: Schema) {
  const rules = [
    ...smartQuotes,
    ellipsis,
    emDash,
    strongStarRule(schema.marks.strong!),
    strongScoreRule(schema.marks.strong!),
    emStarRule(schema.marks.em!),
    emScoreRule(schema.marks.em!),
  ];

  return inputRules({ rules });
}

export function strongStarRule(markType: MarkType) {
  return markInputRule(/\*\*([^\*]+)\*\*$/, markType);
}

export function strongScoreRule(markType: MarkType) {
  return markInputRule(/__([^\*_]+)__$/, markType);
}

export function emStarRule(markType: MarkType) {
  return markInputRule(reback("(?<!\\*)\\*([^\\*]+)\\*$", /\*([^\*]+)\*$/), markType);
}

export function emScoreRule(markType: MarkType) {
  return markInputRule(reback("(?<!_)_([^_]+)_$", /\_([^\_]+)\_$/), markType);
}

export function markInputRule(
  regexp: RegExp,
  markType: MarkType,
  getAttrs?: ((match: string[]) => { [key: string]: string }) | { [key: string]: string }
) {
  return new InputRule(regexp, (state, match, start, end) => {
    let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    let tr = state.tr;

    if (match[1]) {
      let textStart = start + match[0]!.indexOf(match[1]);
      let textEnd = textStart + match[1].length;
      if (textEnd < end) tr.delete(textEnd, end);
      if (textStart > start) tr.delete(start, textStart);
      end = start + match[1].length;
    }

    tr.addMark(start, end, markType.create(attrs));
    tr.removeStoredMark(markType); // Do not continue with mark.

    return tr;
  });
}

export function reback(re: string, fallback: RegExp): RegExp {
  try {
    return new RegExp(re);
  } catch {
    return fallback;
  }
}

/* ---------------------------------------------------------------------------------------------- */

const mac = typeof navigator != "undefined" ? /Mac/.test(navigator.platform) : false;

// :: (Schema, ?Object) → Object
// Inspect the given schema looking for marks and nodes from the
// basic schema, and if found, add key bindings related to them.
// This will add:
//
// * **Mod-b** for toggling [strong](#schema-basic.StrongMark)
// * **Mod-i** for toggling [emphasis](#schema-basic.EmMark)
// * **Mod-`** for toggling [code font](#schema-basic.CodeMark)
// * **Ctrl-Shift-0** for making the current textblock a paragraph
// * **Ctrl-Shift-1** to **Ctrl-Shift-Digit6** for making the current
//   textblock a heading of the corresponding level
// * **Ctrl-Shift-Backslash** to make the current textblock a code block
// * **Ctrl-Shift-8** to wrap the selection in an ordered list
// * **Ctrl-Shift-9** to wrap the selection in a bullet list
// * **Ctrl->** to wrap the selection in a block quote
// * **Enter** to split a non-empty textblock in a list item while at
//   the same time splitting the list item
// * **Mod-Enter** to insert a hard break
// * **Mod-_** to insert a horizontal rule
// * **Backspace** to undo an input rule
// * **Alt-ArrowUp** to `joinUp`
// * **Alt-ArrowDown** to `joinDown`
// * **Mod-BracketLeft** to `lift`
// * **Escape** to `selectParentNode`
//
// You can suppress or map these bindings by passing a `mapKeys`
// argument, which maps key names (say `"Mod-B"` to either `false`, to
// remove the binding, or a new key name string.
export function createKeymap(schema, mapKeys?) {
  let keys = {},
    type;

  function bind(key, cmd) {
    if (mapKeys) {
      let mapped = mapKeys[key];
      if (mapped === false) return;
      if (mapped) key = mapped;
    }
    keys[key] = cmd;
  }

  bind("Enter", function split() {
    console.log("ENTERED ");
    return false;
  });
  bind("ArrowDown", (state: EditorState<any>, dispatch: (t: Transaction<any>) => void) => {
    console.log("KEYDOWN", state.selection.$to.pos === state.selection.$to.end());
    return false;
  });
  bind("Mod-z", undo);
  bind("Shift-Mod-z", redo);
  bind("Backspace", undoInputRule);

  if (!mac) bind("Mod-y", redo);

  bind("Alt-ArrowUp", joinUp);
  bind("Alt-ArrowDown", joinDown);
  bind("Mod-BracketLeft", lift);
  bind("Escape", selectParentNode);

  if ((type = schema.marks.strong)) {
    bind("Mod-b", toggleMark(type));
    bind("Mod-B", toggleMark(type));
  }

  if ((type = schema.marks.em)) {
    bind("Mod-i", toggleMark(type));
    bind("Mod-I", toggleMark(type));
  }

  if ((type = schema.marks.code)) bind("Mod-`", toggleMark(type));

  if ((type = schema.nodes.bullet_list)) bind("Shift-Ctrl-8", wrapInList(type));

  if ((type = schema.nodes.ordered_list)) bind("Shift-Ctrl-9", wrapInList(type));

  if ((type = schema.nodes.blockquote)) bind("Ctrl->", wrapIn(type));

  if ((type = schema.nodes.hard_break)) {
    let br = type,
      cmd = chainCommands(exitCode, (state, dispatch) => {
        dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
        return true;
      });
    bind("Mod-Enter", cmd);
    bind("Shift-Enter", cmd);
    if (mac) bind("Ctrl-Enter", cmd);
  }

  if ((type = schema.nodes.list_item)) {
    // bind("Enter", splitListItem(type))
    bind("Mod-[", liftListItem(type));
    bind("Mod-]", sinkListItem(type));
  }

  if ((type = schema.nodes.paragraph)) bind("Shift-Ctrl-0", setBlockType(type));

  if ((type = schema.nodes.code_block)) bind("Shift-Ctrl-\\", setBlockType(type));

  if ((type = schema.nodes.heading))
    for (let i = 1; i <= 6; i++) bind("Shift-Ctrl-" + i, setBlockType(type, { level: i }));

  if ((type = schema.nodes.horizontal_rule)) {
    let hr = type;
    bind("Mod-_", (state, dispatch) => {
      dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
      return true;
    });
  }

  console.log(keys);
  return keys;
}
