import { Component, onMount } from "solid-js";
import { MetaProvider, Title, Link, Meta } from "solid-meta";

export const Layout: Component<{ title?: string }> = (props) => {
	onMount(() => {
		// Remove the default <title /> in HTML
		document.querySelector("title")?.remove();
	});

	return (
		<>
			<MetaProvider>
				<Title>{props.title + " - " ?? ""}ImmerNote</Title>
			</MetaProvider>
			{props.children}
		</>
	);
};
