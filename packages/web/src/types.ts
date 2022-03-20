import type Sockette from "sockette";

/* ---------------------------------------------------------------------------------------------- */
/*                                              User                                              */
/* ---------------------------------------------------------------------------------------------- */

export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  settings: UserSettings;
  confirmation_token: string | null;
  confirmation_sent_at: string | null;
  invited_at: string | null;
  confirmed_at: string | null;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
};

export type UserSettings = {};

/* ---------------------------------------------------------------------------------------------- */
/*                                              Space                                             */
/* ---------------------------------------------------------------------------------------------- */

export type Space = {
  id: string;
  handle: string;
  name: string;
  icon: SpaceIcon;
  settings: SpaceSettings;
  domains: string[];
  invitation_token: string | null;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
};

export type SpaceIcon = {
  type: string;
  value: string;
};

export type SpaceSettings = {};

/* ---------------------------------------------------------------------------------------------- */
/*                                              Block                                             */
/* ---------------------------------------------------------------------------------------------- */

export type Block =
  | {
      type: "page";
      content: { title: string };
      format: { icon: { type: string; value: string } };

      id: string;
      space_id: string;

      created_by: string;
      modified_by: string;

      created_at: number;
      modified_at: number;
      deleted_at: number | null;

      children: string[];
      root_page_id: string;
    }
  | {
      type: "database";
      content: { title: string };
      format: { icon: { type: string; value: string } };

      id: string;
      space_id: string;

      created_by: string;
      modified_by: string;

      created_at: number;
      modified_at: number;
      deleted_at: number | null;

      children: string[];
    }
  | {
      type: "field";
      content: { title: string };
      format: { icon: { type: string; value: string } };

      id: string;
      space_id: string;

      created_by: string;
      modified_by: string;

      created_at: number;
      modified_at: number;
      deleted_at: number | null;

      children: string[];
    }
  | {
      type: "text_field";
      content: {};
      format: {};

      id: string;
      space_id: string;

      created_by: string;
      modified_by: string;

      created_at: number;
      modified_at: number;
      deleted_at: number | null;

      children: string[];
    }
  | {
      type: "view";
      content: { title: string };
      format: { icon: { type: string; value: string } };

      id: string;
      space_id: string;

      created_by: string;
      modified_by: string;

      created_at: number;
      modified_at: number;
      deleted_at: number | null;

      children: string[];
    }
  | {
      type: "table_view";
      content: { fields: string[] };
      format: { fields: { [id: string]: any } };

      id: string;
      space_id: string;

      created_by: string;
      modified_by: string;

      created_at: number;
      modified_at: number;
      deleted_at: number | null;

      children: string[];
    }
  | {
      type: "paragraph";
      content: { nodes: any[] };
      format: {};

      id: string;
      space_id: string;

      created_by: string;
      modified_by: string;

      created_at: number;
      modified_at: number;
      deleted_at: number | null;

      children: string[];
    };

export type BlockType = Block["type"];

/* ---------------------------------------------------------------------------------------------- */
/*                                            DataStore                                           */
/* ---------------------------------------------------------------------------------------------- */

export type DataStore = {
  spaces: {
    [key: string]: Space;
  };
  blocks: {
    [key: string]: Block;
  };
  pages: {
    [key: string]: string[];
  };
  users: {
    [key: string]: User;
  };
  user: DataStore["users"][string]["id"] | undefined;
};

/* ---------------------------------------------------------------------------------------------- */
/*                                             WsStore                                            */
/* ---------------------------------------------------------------------------------------------- */

export type WsStore = {
  is_ready: boolean;
  ws: undefined | Sockette;
};

/* ---------------------------------------------------------------------------------------------- */
/*                                            MsgStore                                            */
/* ---------------------------------------------------------------------------------------------- */

export type MsgStore = {
  queue: Msg[];
};

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

export type MsgParams<T extends Msg["type"], S extends BlockType> = Extract<
  Extract<Msg, { type: T }>["payload"],
  { type: S }
>;
