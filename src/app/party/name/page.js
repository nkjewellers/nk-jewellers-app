"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";

const supabase = createClient(
  "https://norfynjyeeqrqqcqjawp.supabase.co",
  "sb_publishable_CVSigeYJoONriiY2j0yXvg_hvU4d9ZM"
);

export default function PartyPage() {
  const { name } = useParams();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("party_name", name);

    setEntries(data || []);
  };

  let totalGold = 0;
  let totalCash = 0;

  entries.forEach((e) => {
    totalGold += Number(e.gold || 0);
    totalCash += Number(e.cash || 0);
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>💎 Party: {name}</h2>

      <h3>Gold: {totalGold} g</h3>
      <h3 style={{ color: totalCash >= 0 ? "green" : "red" }}>
        Cash: ₹ {totalCash}
      </h3>

      <h3 style={{ marginTop: 20 }}>Entries</h3>

      {entries.map((e) => (
        <div key={e.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <div>
            Gold: {e.gold} | Cash: ₹ {e.cash}
          </div>

          {e.note && <div>📝 {e.note}</div>}
        </div>
      ))}
    </div>
  );
}