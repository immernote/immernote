import { useParams } from "solid-app-router";
import { Layout } from "../components/layout";
import { Sidebar } from "../components/sidebar";

export default function Page() {
	const { id } = useParams<{ id: string }>();

	return (
		<Layout title="Page">
			<div className="h-screen w-full tracking-tight flex items-center">
				<Sidebar />
				<main className="flex-grow h-screen w-full bg-slate-500">Main stuff</main>
			</div>
		</Layout>
	);
}
