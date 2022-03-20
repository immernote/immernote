import { Block } from "./Block";
import { Space } from "./Space";
import { User } from "./User";

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
