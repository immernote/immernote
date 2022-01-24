import { useParams } from "react-router-dom";
import { Layout } from "../components/layout";
import { Link } from "../components/link";

export default function Page() {
	const { id } = useParams<{ id: string }>();

	return (
		<Layout title="Page">
			<Link to={`/${id}d`}>Next one?</Link>
		</Layout>
	);
}
