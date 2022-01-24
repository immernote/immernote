import { ComponentProps, splitProps } from "solid-js";
import { Link as RouterLink } from "solid-app-router";

type LinkProps = {
	variant?: "blue" | "subtle" | "contrast";
};

export function Link(props: ComponentProps<typeof RouterLink> & LinkProps) {
	const [local, rest] = splitProps(props, ["children", "className", "variant"]);

	return (
		<RouterLink
			classList={{
				[local.className]: !!local.className,
				"text-base tracking-tight transition-[text-decoration-color] inline-flex items-center justify-center space-x-2 text-decoration text-decoration-underline text-decoration-transparent":
					true,
				"text-blue11 hover:text-decoration-blue4 focus:text-decoration-blue8": local.variant === "blue",
				"text-gray11 hover:text-decoration-gray4 focus:text-decoration-gray8": local.variant === "subtle",
				"text-gray12 text-decoration-gray4 hover:text-decoration-gray7 focus:text-decoration-gray8":
					local.variant === "contrast",
			}}
			style={{ textUnderlineOffset: "3px" }}
			{...rest}
		>
			{local.children}
		</RouterLink>
	);
}
