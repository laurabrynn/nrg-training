"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

interface Property {
  id: string;
  name: string;
  state: string;
}

interface Props {
  userId: string;
  properties: Property[];
  currentPropertyId: string | null;
}

const stateLabel: Record<string, string> = {
  dc: "DC", va: "VA", md: "MD", la: "NOLA",
};

export default function AssignProperty({ userId, properties, currentPropertyId }: Props) {
  const [value, setValue] = useState(currentPropertyId ?? "");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  function handleChange(propertyId: string) {
    setValue(propertyId);
    setSaved(false);
    startTransition(async () => {
      if (!propertyId) {
        await supabase.from("user_properties").delete().eq("user_id", userId);
      } else {
        await supabase.from("user_properties").upsert(
          { user_id: userId, property_id: propertyId },
          { onConflict: "user_id,property_id" }
        );
      }
      setSaved(true);
    });
  }

  const byState = properties.reduce<Record<string, Property[]>>((acc, p) => {
    if (!acc[p.state]) acc[p.state] = [];
    acc[p.state].push(p);
    return acc;
  }, {});

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-nrg-green bg-white text-gray-700 disabled:opacity-50"
      >
        <option value="">— Unassigned —</option>
        {Object.entries(byState).map(([state, props]) => (
          <optgroup key={state} label={stateLabel[state] ?? state.toUpperCase()}>
            {props.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      {saved && <span className="text-xs text-green-500">Saved</span>}
    </div>
  );
}
