import { Outlet } from "react-router-dom";
import { Layout } from "../components/layout";
import { Sidebar } from "../components/sidebar";

export default function App() {
	return (
		<Layout title="Page">
			<div className="h-screen w-full tracking-tight flex items-center">
				<Sidebar />
				<main className="flex-grow h-screen w-full bg-slate-500">
					<Outlet />
				</main>
			</div>
		</Layout>
	);
}
