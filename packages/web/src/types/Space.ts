import { SpaceSettings } from "./SpaceSettings";
import { SpaceIcon } from "./SpaceIcon";

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
