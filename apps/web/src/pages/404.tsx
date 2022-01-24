import { Layout } from "../components/layout";
import { Link } from "../components/link";
import { Header } from "../components/header";

export default function NotFound() {
	return (
		<Layout title="Page Not Found">
			<div className="max-w-7xl mx-auto min-h-screen tracking-tight flex flex-col items-center px-4">
				<Header />
				<div className="flex flex-col items-start min-h-full flex-grow mt-32 max-w-lg w-full">
					<h1 className="text-4xl font-semibold tracking-tight mb-12">Page Not Found</h1>
					<Link href="/" variant="blue">
						Go back home?
					</Link>
				</div>
			</div>
		</Layout>
	);
}
