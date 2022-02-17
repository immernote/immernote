import { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions/auth";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { Layout } from "../components/layout";
import { delay } from "../utils/delay";

export default function Login() {
	const [state, setState] = useState<"idle" | "waiting" | "success" | "error">("idle");
	const [error, setError] = useState<string>();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ email: string }>();
	const onSubmit = async ({ email }: { email: string }) => {
		setState("waiting");

		const [_, loginError, otherError] = await login(email);

		await delay(1000);

		if (loginError || otherError) {
			setState("error");
			if (loginError) {
				setError("User not found");
			}

			await delay(1000);
			setState("idle");
			return;
		}

		setState("success");
	};

	return (
		<Layout title="Log in">
			<div className="max-w-7xl mx-auto min-h-screen tracking-tight flex flex-col items-center px-4">
				<Header />
				{state !== "success" ? (
					<form className="flex flex-col items-start flex-grow max-w-lg w-full mt-32" onSubmit={handleSubmit(onSubmit)}>
						<h1 className="text-4xl font-medium tracking-tight mb-12">Log in</h1>
						<label htmlFor="email" className="tracking-tight font-semibold mb-2 text-lg select-none">
							Email
						</label>
						<input
							id="email"
							type="email"
							className={`rounded px-2 h-10 text-lg border-0 hover:border-blue8 ring-1 ring-gray7 focus:ring-2 focus:ring-blue8 text-gray12 transition bg-gray1 mb-8 placeholder-gray9 w-full`}
							placeholder="jay@example.com"
							disabled={state === "waiting"}
							{...register("email", { required: true })}
						/>
						{(errors.email || error) && (
							<p className="text-red11 tracking-tight font-medium mb-8 -mt-6">User not found</p>
						)}
						<Button variant="blue" state={state} type="submit" size="sm">
							Continue
						</Button>
					</form>
				) : (
					<div className="tracking-tight font-medium text-2xl flex flex-grow mt-32">
						<p>
							Please check your email—
							<br />
							we just sent you a confirmation link.
						</p>
					</div>
				)}
			</div>
		</Layout>
	);
}
