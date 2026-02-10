import Link from "next/link";
import { ui } from "@/lib/ui";

export default function OnboardingPage() {
  return (
    <main className={ui.container}>
      <div className={ui.card}>
        <div className={ui.h1}>Welcome</div>
        <div className={ui.p}>Choose how you want to start.</div>

        <div className="mt-6 grid gap-3">
          <Link className={ui.button} href="/create-venture">
            Create a team (Captain)
          </Link>
          <Link className={ui.buttonGhost} href="/join">
            Join a team (Enter code)
          </Link>
          <Link className={ui.buttonGhost} href="/game">
            Go to game
          </Link>
        </div>
      </div>
    </main>
  );
}
