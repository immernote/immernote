import { NavLink } from "react-router-dom";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";

type LinkProps = {
	variant?: "blue" | "subtle" | "contrast";
	asChild?: boolean;
};

export function Link({
	className,
	variant,
	children,
	asChild,
	...props
}: ComponentPropsWithoutRef<typeof NavLink> & LinkProps) {
	const Comp = asChild ? Slot : NavLink;

	return (
		<Comp
			className={clsx({
				[className as string]: !!className,
				"text-base tracking-tight transition-[text-decoration-color] inline-flex items-center justify-center space-x-2 text-decoration text-decoration-underline text-decoration-transparent":
					true,
				"text-blue11 hover:text-decoration-blue4 focus:text-decoration-blue8": variant === "blue",
				"text-gray11 hover:text-decoration-gray4 focus:text-decoration-gray8": variant === "subtle",
				"text-gray12 text-decoration-gray4 hover:text-decoration-gray7 focus:text-decoration-gray8":
					variant === "contrast",
			})}
			style={{ textUnderlineOffset: "3px" }}
			{...props}
		>
			{children}
		</Comp>
	);
}
