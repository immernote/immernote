import { Layout } from "../components/layout";
import { Header } from "../components/header";

export default function Home() {
	return (
		<Layout title="Page Not Found">
			<div className="max-w-7xl mx-auto min-h-screen tracking-tight flex flex-col items-center px-4">
				<Header />
				<div className="flex flex-col items-start min-h-full flex-grow mt-32 max-w-lg w-full">
					<h1 className="text-4xl font-semibold tracking-tight mb-12">Home</h1>
				</div>
			</div>
		</Layout>
	);
}
