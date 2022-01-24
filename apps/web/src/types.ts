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

export type Block = {
  /** UUID */
  id: string;
  type: string;
  rank: string;
  content: { title: string };
  format: { icon: { type: string; value: string } };
  parent_block_id: string | undefined;
  parent_page_id: string | undefined;
  /** UUID */
  space_id: string;
  /** UUID */
  created_by: string;
  /** UUID */
  modified_by: string;
  /** Timestamptz */
  created_at: string;
  /** Timestamptz */
  modified_at: string;
  /** Timestamptz */
  deleted_at: string | undefined;
};
