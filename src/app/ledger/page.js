"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://norfynjyeeqrqqcqjawp.supabase.co",
  "sb_publishable_CVSigeYJoONriiY2j0yXvg_hvU4d9ZM"
);

export default function LedgerPage() {
  const params = useSearchParams();
  const party = params.get("party");

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchData();
  }, [party]);

  async function fetchData() {
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("party_name", party)
      .order("created_at", { ascending: false });

    setEntries(data || []);
  }

  const totalGold = entries.reduce((s, e) => s + (e.gold || 0), 0);
  const totalCash = entries.reduce((s, e) => s + (e.cash || 0), 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>📒 {party} Ledger</h2>

      <div style={{ marginBottom: 20 }}>
        <b>Total Gold:</b> {totalGold} g <br />
        <b>Total Cash:</b> ₹ {totalCash}
      </div>

      {entries.map((e) => (
        <div key={e.id} style={card}>
          Gold: {e.gold} g | Cash: ₹ {e.cash} <br />
          <small>{new Date(e.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 10,
  marginBottom: 10,
  borderRadius: 5,
};