import { memo } from "react";
import { dequal } from "dequal/lite";
import { ParagraphBlock } from "./ParagraphBlock";
import { DatabaseBlock } from "./DatabaseBlock";
import { PageBlock } from "./PageBlock";

type BlockSwitchPrpos = {
  id: string;
  type: string;
  is_root?: boolean;
};

export const BlockSwitch = memo(function BlockSwitch({ id, type, is_root }: BlockSwitchPrpos) {
  if (is_root) {
    switch (type) {
      case "page": {
        return <PageBlock key={id} id={id} />;
      }
      case "paragraph": {
        return <ParagraphBlock key={id} id={id} />;
      }
      case "database": {
        return <DatabaseBlock key={id} id={id} />;
      }
      case "field": {
        return <PageBlock key={id} id={id} />;
      }
      case "view": {
        return <PageBlock key={id} id={id} />;
      }

      default: {
        console.error(`Unknown block type "${type}"`);
        return null;
      }
    }
  }

  switch (type) {
    case "page": {
      return <PageBlock key={id} id={id} />;
    }
    case "paragraph": {
      return <ParagraphBlock key={id} id={id} />;
    }
    case "database": {
      return <DatabaseBlock key={id} id={id} />;
    }
    case "field": {
      return <PageBlock key={id} id={id} />;
    }
    case "view": {
      return <PageBlock key={id} id={id} />;
    }

    default: {
      console.error(`Unknown block type "${type}"`);
      return null;
    }
  }
}, dequal);
