import { Block } from "./Block";
import { BlockType } from "./BlockType";

export type Msg =
  | {
      type: "add_blocks";
      payload: {
        ids: string[];
        types: BlockType[];
        parent_ids: (string | null)[];
        contents: Block["content"][];
        formats: Block["format"][];
      };
    }
  | {
      type: "add_block";
      payload: {
        id: string;
        type: "page";
        parent_id: string | null;
        content: Extract<Block, { type: "page" }>["content"];
        format: Extract<Block, { type: "page" }>["format"];
      };
    }
  | {
      type: "add_block";
      payload: {
        id: string;
        type: "paragraph";
        parent_id: string | null;
        content: Extract<Block, { type: "paragraph" }>["content"];
        format: Extract<Block, { type: "paragraph" }>["format"];
      };
    }
  | {
      type: "add_block";
      payload: {
        id: string;
        type: "database";
        parent_id: string | null;
        content: Extract<Block, { type: "database" }>["content"];
        format: Extract<Block, { type: "database" }>["format"];
      };
    }
  | {
      type: "add_block";
      payload: {
        id: string;
        type: "view";
        parent_id: string | null;
        content: Extract<Block, { type: "view" }>["content"];
        format: Extract<Block, { type: "view" }>["format"];
      };
    }
  | {
      type: "add_block";
      payload: {
        id: string;
        type: "table_view";
        parent_id: string | null;
        content: Extract<Block, { type: "view" }>["content"];
        format: Extract<Block, { type: "view" }>["format"];
      };
    }
  | {
      type: "add_block";
      payload: {
        id: string;
        type: "field";
        parent_id: string | null;
        content: Extract<Block, { type: "field" }>["content"];
        format: Extract<Block, { type: "field" }>["format"];
      };
    }
  | {
      type: "add_block";
      payload: {
        id: string;
        type: "text_field";
        parent_id: string | null;
        content: Extract<Block, { type: "text_field" }>["content"];
        format: Extract<Block, { type: "text_field" }>["format"];
      };
    }
  | {
      type: "add_field";
      payload: {
        id: string;
        type: "text_field";
        parent_id: string | null;
        content: Extract<Block, { type: "text_field" }>["content"];
        format: Extract<Block, { type: "text_field" }>["format"];
        view_id: string | null;
      };
    }
  | {
      type: "add_database";
      payload: {
        database_id: string;
        type: "database";
        parent_id: string | null;
      };
    }
  | {
      type: "replace_block";
      payload: {
        id: string;
        type: "page";
        content: Extract<Block, { type: "page" }>["content"] | null;
        format: Extract<Block, { type: "page" }>["format"] | null;
      };
    }
  | {
      type: "replace_block";
      payload: {
        id: string;
        type: "paragraph";
        content: Extract<Block, { type: "paragraph" }>["content"] | null;
        format: Extract<Block, { type: "paragraph" }>["format"] | null;
      };
    }
  | {
      type: "replace_block";
      payload: {
        id: string;
        type: "database";
        content: Extract<Block, { type: "database" }>["content"] | null;
        format: Extract<Block, { type: "database" }>["format"] | null;
      };
    }
  | {
      type: "replace_block";
      payload: {
        id: string;
        type: "view";
        content: Extract<Block, { type: "view" }>["content"] | null;
        format: Extract<Block, { type: "view" }>["format"] | null;
      };
    }
  | {
      type: "replace_block";
      payload: {
        id: string;
        type: "table_view";
        content: Extract<Block, { type: "table_view" }>["content"] | null;
        format: Extract<Block, { type: "table_view" }>["format"] | null;
      };
    }
  | {
      type: "replace_block";
      payload: {
        id: string;
        type: "field";
        content: Extract<Block, { type: "field" }>["content"] | null;
        format: Extract<Block, { type: "field" }>["format"] | null;
      };
    };
