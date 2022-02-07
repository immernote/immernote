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

export type BlocksMain =
  | {
      type: "page";
      content: { title: string };
      format: { icon: { type: string; value: string } };
    }
  | {
      type: "paragraph";
      content: { nodes: any[] };
      format: {};
    };

export type Block<T extends BlocksMain["type"] = "paragraph"> = Extract<BlocksMain, { type: T }> & {
  type: T;
  id: string;
  space_id: string;

  created_by: string;
  modified_by: string;

  created_at: number;
  modified_at: number;
  deleted_at: number | null;

  children: string[];
};

/* ---------------------------------------------------------------------------------------------- */
/*                                            DataStore                                           */
/* ---------------------------------------------------------------------------------------------- */

export type DataStore = {
  spaces: {
    [key: string]: Space;
  };
  blocks: {
    [key: string]: Block<any>;
  };
  pages: {
    [key: string]: string[];
  };
  users: {
    [key: string]: User;
  };
  user: DataStore["users"][string] | undefined;
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
      type: "ping";
      page_id: string;
    }
  | {
      type: "add_page";
      id: string;
      parent_id: string | null;
      content: Block<"page">["content"];
      format: Block<"page">["format"];
    }
  | {
      type: "add_block";
      id: string;
      parent_id: string;
      content: Block<"paragraph">["content"];
      format: Block<"paragraph">["format"];
    }
  | {
      type: "replace_block_content";
      id: string;
      content: Block["content"];
    }
  | {
      type: "replace_block_format";
      id: string;
      content: Block["format"];
    };

type ExcludeTypeField<A> = { [K in Exclude<keyof A, "type">]: A[K] };
export type MsgParams<T extends Msg["type"]> = ExcludeTypeField<Extract<Msg, { type: T }>>;
