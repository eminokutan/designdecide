import { ui } from "@/lib/ui";

export function ScenarioNode(props: { title: string; body: string }) {
  return (
    <div className={ui.card}>
      <div className={ui.h1}>{props.title}</div>
      <div className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{props.body}</div>
    </div>
  );
}
