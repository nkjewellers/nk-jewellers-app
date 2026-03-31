"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://norfynjyeeqrqqcqjawp.supabase.co",
  "sb_publishable_CVSigeYJoONriiY2j0yXvg_hvU4d9ZM"
);

export default function Home() {
  const [party, setParty] = useState("");
  const [gold, setGold] = useState("");
  const [cash, setCash] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const { data } = await supabase
      .from("entries")
      .select("*")
      .order("created_at", { ascending: false });
    setEntries(data || []);
  }

  async function addEntry() {
    if (!party) return;

    await supabase.from("entries").insert([
      {
        party_name: party,
        gold: Number(gold),
        cash: Number(cash),
      },
    ]);

    setParty("");
    setGold("");
    setCash("");
    fetchEntries();
  }

  const totalGold = entries.reduce((sum, e) => sum + (e.gold || 0), 0);
  const totalCash = entries.reduce((sum, e) => sum + (e.cash || 0), 0);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: 20 }}>💎 N.K Jewellers Ledger</h1>

      {/* Form */}
      <div style={{
        padding: 20,
        borderRadius: 10,
        background: "#f5f5f5",
        marginBottom: 20
      }}>
        <input
          placeholder="Party Name"
          value={party}
          onChange={(e) => setParty(e.target.value)}
        /><br /><br />

        <input
          placeholder="Gold (grams)"
          value={gold}
          onChange={(e) => setGold(e.target.value)}
        /><br /><br />

        <input
          placeholder="Cash (₹)"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
        /><br /><br />

        <button onClick={addEntry}>➕ Add Entry</button>
      </div>

      {/* Totals */}
      <div style={{
        display: "flex",
        gap: 20,
        marginBottom: 20
      }}>
        <div style={{ padding: 15, background: "#e6f7ff", borderRadius: 10 }}>
          <b>Total Gold:</b> {totalGold} g
        </div>
        <div style={{ padding: 15, background: "#fff7e6", borderRadius: 10 }}>
          <b>Total Cash:</b> ₹ {totalCash}
        </div>
      </div>

      {/* Entries */}
      <div style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10
      }}>
        <h3>Entries</h3>

        {entries.length === 0 && <p>No entries yet</p>}

        {entries.map((e) => (
          <div key={e.id} style={{
            padding: 10,
            borderBottom: "1px solid #eee"
          }}>
            <b>{e.party_name}</b>  
            <br />
            Gold: {e.gold} g | Cash: ₹ {e.cash}
          </div>
        ))}
      </div>
    </div>
  );
}