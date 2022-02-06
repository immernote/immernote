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

export type Block = (
  | {
      type: "paragraph";
      content: { nodes: any[] };
      format: {};
    }
  | {
      type: "page";
      content: { title: string };
      format: { icon: { type: string; value: string } };
    }
) & {
  id: string;
  space_id: string;

  created_by: string;
  modified_by: string;

  created_at: string;
  modified_at: string;
  deleted_at: string | null;

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
    [key: string]: Block;
  };
  pages: {
    [key: string]: string[];
  };
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

export type Msg = {
  type: "patch";
  data: {
    op: "replace" | "remove" | "add";
    path: (string | number)[];
    value?: any;
    modified_at?: string;
  }[];
};
