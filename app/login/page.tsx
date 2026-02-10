import dynamic from "next/dynamic";
import { ui } from "@/lib/ui";

const AuthForm = dynamic(() => import("@/components/AuthForm"), { ssr: false });

export default function LoginPage() {
  return (
    <main className={ui.container}>
      <div className="mb-6">
        <div className={ui.h1}>Product Development Case Game</div>
        <div className={ui.p}>Team-based branching scenarios. One shared decision per node.</div>
      </div>
      <AuthForm />
    </main>
  );
}
