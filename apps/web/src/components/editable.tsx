import { ProseMirror, useTextBlock } from "../lib/prosemirror";

let ct = ` {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Maker of things"}]}]}`;

const p = JSON.parse(ct);

export function Editable() {
  const [state, setState] = useTextBlock(p);
  return (
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
  );
}
