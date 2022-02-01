import { ProseMirror, useTextBlock } from "../lib/prosemirror";

let ct = ` {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Maker of things"}]}]}`;

const p = JSON.parse(ct);

type EditableProps = {
  id: string;
};

export function Editable({ id }: EditableProps) {
  const [state, set_state] = useTextBlock(p);
  return (
    <ProseMirror
      state={state}
      on_state_change={set_state}
      on_doc_change={console.log}
      on_delete_block={() => {
        console.log("DELETE THIS BLOCK");
      }}
      on_insert_blocks={(blocks) => {
        console.log("INSERTS THESE BLOCKS", blocks);
      }}
      on_arrow_down={() => {}}
      on_arrow_up={() => {}}
      is_first={false}
      is_last={false}
    />
  );
}
