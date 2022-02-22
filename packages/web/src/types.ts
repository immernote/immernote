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
      type: "database";
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
  queue: Msg<any>[];
};

export type Msg<BlockType extends BlocksMain["type"]> =
  | {
      type: "add_block";
      payload: {
        id: string;
        type: BlockType;
        parent_id: string | null;
        content: Block<BlockType>["content"];
        format: Block<BlockType>["format"];
      };
    }
  | {
      type: "replace_block";
      payload: {
        id: string;
        content: Block<BlockType>["content"] | null;
        format: Block<BlockType>["format"] | null;
      };
    };

export type MsgParams<T extends Msg<any>["type"], BlockType extends BlocksMain["type"]> = Extract<
  Msg<BlockType>,
  { type: T }
>["payload"];
