export function Sidebar() {
	return (
		<div className="min-w-[calc(100%/5)] w-1/5 bg-gray1 h-screen flex flex-col items-stretch">
			<Workspaces />
			<Links />
			<Pages />
			<CreatePage />
		</div>
	);
}

function Workspaces() {
	return <div className="font-medium tracking-tight transition hover:bg-gray3 px-4 py-4 text-sm">Workspaces</div>;
}

function Links() {
	return (
		<>
			<div className="font-medium tracking-tight transition hover:bg-gray3 px-4 py-1 text-sm">Search</div>
			<div className="font-medium tracking-tight transition hover:bg-gray3 px-4 py-1 text-sm">Settings</div>
		</>
	);
}

function Pages() {
	return <nav className="flex flex-col items-stretch w-full flex-grow min-h-[4rem] text-sm bg-gray2">Loading...</nav>;
}

function CreatePage() {
	return (
		<button className="font-medium tracking-tight transition hover:bg-gray3 px-4 py-2 text-sm text-left">
			New Page
		</button>
	);
}
