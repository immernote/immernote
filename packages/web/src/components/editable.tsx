import { useCallback } from "react";
import { debounce } from "throttle-debounce";
import { ProseMirror, useTextBlock } from "~/lib/prosemirror";

type EditableProps = {
  id: string;
  value: any[];
  set_value: (value: any[]) => void;
};

/**
 * TODO: Pass these functions to the API and state, and handle common keyboard stuff
 */
export function Editable({ id, value, set_value }: EditableProps) {
  const [state, set_state] = useTextBlock({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: value,
      },
    ],
  });
  const debounced_set_value = useCallback(debounce(500, set_value), [set_value]);

  return (
    <ProseMirror
      state={state}
      on_state_change={set_state}
      on_doc_change={(doc) => {
        debounced_set_value(doc.content[0].content);
      }}
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
