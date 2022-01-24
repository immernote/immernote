import { Check, Loader, X } from "lucide-solid";
import { ComponentProps, splitProps } from "solid-js";

type ButtonProps = {
	base?: boolean;
	size?: "sm" | "lg" | "xl";
	variant?: "gray" | "red" | "blue" | "amber" | "ghost";
	state?: "idle" | "waiting" | "success" | "error";
};

export function Button(props: ComponentProps<"button"> & ButtonProps) {
	const [local, rest] = splitProps(props, ["children", "className", "size", "state", "variant"]);

	return (
		<button
			classList={{
				[local.className]: !!local.className,
				"rounded px-4 tracking-tight font-medium transition inline-flex items-center justify-center": true,
				"h-8 text-sm": local.size === "sm",
				"h-10 text-lg": local.size === "lg",
				"h-12 text-xl": local.size === "xl",
				"bg-green3 text-green11 cursor-default": local.state === "success",
				"bg-gray5 text-gray11 cursor-wait": local.state === "waiting",
				"bg-red5 text-red11 cursor-not-allowed": local.state === "error",
				"bg-amber3 hover:bg-amber4 focus:bg-amber5 text-amber11":
					(!local.state || local.state === "idle") && local.variant === "amber",
				"bg-gray3 hover:bg-gray4 focus:bg-gray5 text-gray11":
					(!local.state || local.state === "idle") && local.variant === "gray",
				"bg-blue3 hover:bg-blue4 focus:bg-blue5 text-blue11":
					(!local.state || local.state === "idle") && local.variant === "blue",
				"bg-transparent hover:bg-gray3 focus:bg-gray4 text-gray12":
					(!local.state || local.state === "idle") && local.variant === "ghost",
				"bg-red3 hover:bg-red4 focus:bg-red5 text-red11":
					(!local.state || local.state === "idle") && local.variant === "red",
			}}
			disabled={local.state === "waiting" || local.state === "error"}
			{...rest}
		>
			<span
				classList={{
					"inline-flex gap-x-2 justify-center items-center": true,
					invisible: ["waiting", "success", "error"].includes(local.state),
				}}
			>
				{local.children}
			</span>
			{local.state === "waiting" && <Loader className="absolute animate-spin" />}
			{local.state === "success" && <Check className="absolute" />}
			{local.state === "error" && <X className="absolute" />}
		</button>
	);
}
