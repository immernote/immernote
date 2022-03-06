import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { Check, Loader, X } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  base?: boolean;
  size?: "sm" | "lg" | "xl";
  variant?: "gray" | "red" | "blue" | "amber" | "ghost";
  state?: "idle" | "waiting" | "success" | "error";
  asChild?: boolean;
};

export function Button({
  className,
  children,
  size,
  state = "idle",
  variant,
  asChild,
  ...props
}: ComponentPropsWithoutRef<"button"> & ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={clsx({
        [className as string]: !!className,
        "rounded px-4 tracking-tight font-medium transition inline-flex items-center justify-center":
          true,
        "h-8 text-sm": size === "sm",
        "h-10 text-lg": size === "lg",
        "h-12 text-xl": size === "xl",
        "bg-green3 text-green11 cursor-default": state === "success",
        "bg-gray5 text-gray11 cursor-wait": state === "waiting",
        "bg-red5 text-red11 cursor-not-allowed": state === "error",
        "bg-amber3 hover:bg-amber4 focus:bg-amber5 text-amber11":
          (!state || state === "idle") && variant === "amber",
        "bg-gray3 hover:bg-gray4 focus:bg-gray5 text-gray11":
          (!state || state === "idle") && variant === "gray",
        "bg-blue3 hover:bg-blue4 focus:bg-blue5 text-blue11":
          (!state || state === "idle") && variant === "blue",
        "bg-transparent hover:bg-gray3 focus:bg-gray4 text-gray12":
          (!state || state === "idle") && variant === "ghost",
        "bg-red3 hover:bg-red4 focus:bg-red5 text-red11":
          (!state || state === "idle") && variant === "red",
      })}
      disabled={state === "waiting" || state === "error"}
      {...props}
    >
      <span
        className={clsx({
          "inline-flex gap-x-2 justify-center items-center": true,
          invisible: ["waiting", "success", "error"].includes(state),
        })}
      >
        {children}
      </span>
      {state === "waiting" && <Loader className="absolute animate-spin" />}
      {state === "success" && <Check className="absolute" />}
      {state === "error" && <X className="absolute" />}
    </Comp>
  );
}
