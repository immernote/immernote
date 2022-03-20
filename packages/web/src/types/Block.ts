
export type Block = {
  type: "page";
  content: { title: string; };
  format: { icon: { type: string; value: string; }; };

  id: string;
  space_id: string;

  created_by: string;
  modified_by: string;

  created_at: number;
  modified_at: number;
  deleted_at: number | null;

  children: string[];
  root_page_id: string;
} |
{
  type: "database";
  content: { title: string; };
  format: { icon: { type: string; value: string; }; };

  id: string;
  space_id: string;

  created_by: string;
  modified_by: string;

  created_at: number;
  modified_at: number;
  deleted_at: number | null;

  children: string[];
} |
{
  type: "field";
  content: { title: string; };
  format: { icon: { type: string; value: string; }; };

  id: string;
  space_id: string;

  created_by: string;
  modified_by: string;

  created_at: number;
  modified_at: number;
  deleted_at: number | null;

  children: string[];
} |
{
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
} |
{
  type: "view";
  content: { title: string; };
  format: { icon: { type: string; value: string; }; };

  id: string;
  space_id: string;

  created_by: string;
  modified_by: string;

  created_at: number;
  modified_at: number;
  deleted_at: number | null;

  children: string[];
} |
{
  type: "table_view";
  content: { fields: string[]; };
  format: { fields: { [id: string]: any; }; };

  id: string;
  space_id: string;

  created_by: string;
  modified_by: string;

  created_at: number;
  modified_at: number;
  deleted_at: number | null;

  children: string[];
} |
{
  type: "paragraph";
  content: { nodes: any[]; };
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
