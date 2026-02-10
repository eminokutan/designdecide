"use client";

import { ui } from "@/lib/ui";
import { useState } from "react";

export type Choice = {
  id: string;
  choice_key: string;
  label: string;
  description?: string | null;
};

export default function ChoiceButtons(props: {
  ventureId: string;
  choices: Choice[];
  onAdvanced?: () => void;
}) {
  const [loadingChoiceId, setLoadingChoiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pick(choiceId: string) {
    setError(null);
    setLoadingChoiceId(choiceId);

    try {
      const res = await fetch("/api/make-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ventureId: props.ventureId, choiceId }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to submit decision");

      props.onAdvanced?.();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoadingChoiceId(null);
    }
  }

  return (
    <div className="mt-4 space-y-3">
      {props.choices.map((c) => (
        <button
          key={c.id}
          className="w-full rounded-2xl border p-4 text-left hover:bg-gray-50 disabled:opacity-50"
          disabled={!!loadingChoiceId}
          onClick={() => pick(c.id)}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">
              {c.choice_key}. {c.label}
            </div>
            <div className="text-xs text-gray-500">
              {loadingChoiceId === c.id ? "Submitting…" : "Choose"}
            </div>
          </div>
          {c.description && <div className="mt-1 text-sm text-gray-600">{c.description}</div>}
        </button>
      ))}

      {error && <div className={ui.error}>{error}</div>}
    </div>
  );
}
