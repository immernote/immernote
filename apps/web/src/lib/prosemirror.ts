import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { ellipsis, emDash, InputRule, inputRules, smartQuotes } from "prosemirror-inputrules";
import { keymap } from "prosemirror-keymap";
import { MarkType, Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorProps, EditorView } from "prosemirror-view";
import { createElement, useEffect, useRef, useState } from "react";

interface ProseMirrorProps extends EditorProps {
  state: EditorState;
  onStateChange: (state: EditorState) => void;
  onDocChange: (doc: any) => void;
  onDeleteBlock: () => void;
  onArrowUp: (pos: number) => void;
  onArrowDown: (pos: number) => void;
  onInsertBlocks: (blocks: any[]) => void;
  isFirst: boolean;
  isLast: boolean;
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
          props.onDeleteBlock();
          return true;
        }

        return false;
      },
      dispatchTransaction(transaction) {
        // @ts-ignore
        const isPointer = !!(transaction["meta"] as { [key: string]: boolean })["pointer"];

        if (
          !props.isLast &&
          isArrowDown &&
          !isPointer &&
          transaction.selection.empty &&
          transaction.selection.$to.pos === transaction.selection.$to.end()
        ) {
          props.onArrowDown(viewRef.current.state.selection.anchor);
          return;
        }

        if (
          !props.isFirst &&
          isArrowUp &&
          !isPointer &&
          transaction.selection.empty &&
          transaction.selection.$from.pos === transaction.selection.$from.start()
        ) {
          props.onArrowUp(viewRef.current.state.selection.anchor);
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
        props.onStateChange(newState);
        transaction.docChanged && props.onDocChange(newState.toJSON().doc);
        if (blocks) {
          props.onInsertBlocks(blocks);
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
    plugins: [createInputRules(prose), keymap(baseKeymap), dropCursor(), gapCursor()],
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
