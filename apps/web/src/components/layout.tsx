import { FC } from "react";
import { Helmet } from "react-helmet";

export const Layout: FC<{ title?: string }> = (props) => {
	return (
		<>
			<Helmet>
				<title>{props.title + " - " ?? ""}ImmerNote</title>
			</Helmet>
			{props.children}
		</>
	);
};
