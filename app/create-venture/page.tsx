import CreateVentureForm from "@/components/CreateVentureForm";
import { ui } from "@/lib/ui";

export default function CreateVenturePage() {
  return (
    <main className={ui.container}>
      <CreateVentureForm />
    </main>
  );
}
