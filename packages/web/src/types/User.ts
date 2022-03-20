import { UserSettings } from "./UserSettings";

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
