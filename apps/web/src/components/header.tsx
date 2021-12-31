import { Link } from "solid-app-router"
// import { ThemeSwitcher } from "./ThemeSwitcher"

export function Header() {
	return (
		<div className="w-full flex h-32 items-center justify-between">
			<Link href="/">ImmerNote</Link>
			<div className="flex items-center space-x-8">
				<div>Home</div>
				{/* <ThemeSwitcher /> */}
			</div>
		</div>
	)
}
