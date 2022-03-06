import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirm } from "../actions/confirm";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { Layout } from "../components/layout";
import { Link } from "../components/link";
import { delay } from "../utils/delay";

export default function Confirm() {
  const [state, setState] = useState<"idle" | "waiting" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  async function handleClick(event: any) {
    event.preventDefault();

    setErrorMessage("");
    setState("waiting");
    let [_, userError, otherError] = await confirm(
      searchParams.get("token")!,
      searchParams.get("user_id")!
    );

    await delay(1000);

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
        <div className="flex flex-col items-start min-h-full flex-grow mt-32 max-w-lg w-full">
          <h1 className="text-4xl font-semibold tracking-tight mb-12">Confirm</h1>
          <Button variant="blue" size="sm" state={state} onClick={handleClick} className="mb-8">
            Continue
          </Button>
          {errorMessage && <div className="text-red11 -mt-4 mb-8">{errorMessage}</div>}
          <Link to="/login" variant={state === "error" ? "blue" : "subtle"}>
            Resend link?
          </Link>
        </div>
      </div>
    </Layout>
  );
}
