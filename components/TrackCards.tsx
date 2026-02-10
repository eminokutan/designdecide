"use client";

import { ui } from "@/lib/ui";

export type Track = "product_lighting" | "service_care" | "sustainability_reuse";

const tracks: Array<{
  id: Track;
  title: string;
  blurb: string;
}> = [
  {
    id: "product_lighting",
    title: "Product Startup",
    blurb: "Lighting product: prototyping, manufacturing, market fit.",
  },
  {
    id: "service_care",
    title: "Service Startup",
    blurb: "Care economy: blueprinting, operations, trust, stakeholders.",
  },
  {
    id: "sustainability_reuse",
    title: "Sustainability Startup",
    blurb: "Reusability: circular design, incentives, logistics, adoption.",
  },
];

export default function TrackCards(props: {
  value: Track | null;
  onChange: (t: Track) => void;
}) {
  return (
    <div className={ui.grid3}>
      {tracks.map((t) => {
        const active = props.value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => props.onChange(t.id)}
            className={[
              "rounded-2xl border p-4 text-left transition",
              active ? "border-black bg-gray-50" : "hover:bg-gray-50",
            ].join(" ")}
          >
            <div className="text-base font-semibold">{t.title}</div>
            <div className="mt-1 text-sm text-gray-600">{t.blurb}</div>
            <div className="mt-3 text-xs text-gray-500">{active ? "Selected" : "Select"}</div>
          </button>
        );
      })}
    </div>
  );
}
