import { Layout } from "../components/layout";
import { Link } from "../components/link";
import { Header } from "../components/header";
import { Button } from "../components/button";
import { createSignal } from "solid-js";
import { useNavigate, useSearchParams } from "solid-app-router";
import { confirm } from "../actions/auth";

export default function Confirm() {
	let [state, setState] = createSignal<"idle" | "waiting" | "error" | "success">("idle");
	let [errorMessage, setErrorMessage] = createSignal<string | undefined>();

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	async function handleClick(event: any) {
		event.preventDefault();

		setErrorMessage("");
		setState("waiting");
		let [_, userError, otherError] = await confirm(searchParams.token, searchParams.userID);

		if (userError || otherError) {
			setState("error");
			setErrorMessage("Something went wrong");
			return;
		}

		setState("success");
		navigate("/home");
	}

	return (
		<Layout title="Confirm">
			<div className="max-w-7xl mx-auto min-h-screen tracking-tight flex flex-col items-center px-4">
				<Header />
				<div className="flex flex-col items-start justify-center min-h-full flex-grow -mt-32 max-w-lg w-full">
					<h1 className="text-2xl font-semibold tracking-tight mb-12">Confirm</h1>
					<Button variant="blue" state={state()} onClick={handleClick} className="mb-8">
						Continue
					</Button>
					{errorMessage() && <div className="text-red11 -mt-4 mb-8">{errorMessage}</div>}
					<Link href="/login" variant={state() === "error" ? "blue" : "subtle"}>
						Resend link?
					</Link>
				</div>
			</div>
		</Layout>
	);
}
