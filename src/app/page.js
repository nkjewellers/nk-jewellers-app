"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://norfynjyeeqrqqcqjawp.supabase.co",
  "sb_publishable_CVSigeYJoONriiY2j0yXvg_hvU4d9ZM"
);

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [party, setParty] = useState("");
  const [gold, setGold] = useState("");
  const [cash, setCash] = useState("");
  const [type, setType] = useState("IN");

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
    if (!party) return alert("Enter party name");

    // check duplicate
    const existing = entries.find(
      (e) => e.party_name.toLowerCase() === party.toLowerCase()
    );

    if (existing) {
      const confirmAdd = confirm("Party already exists. Add new entry?");
      if (!confirmAdd) return;
    }

    await supabase.from("entries").insert([
      {
        party_name: party,
        gold: Number(gold) || 0,
        cash: Number(cash) || 0,
        type,
      },
    ]);

    setParty("");
    setGold("");
    setCash("");
    fetchEntries();
  }

  const totalGold = entries.reduce((sum, e) => {
    return e.type === "IN"
      ? sum + (e.gold || 0)
      : sum - (e.gold || 0);
  }, 0);

  const totalCash = entries.reduce((sum, e) => {
    return e.type === "IN"
      ? sum + (e.cash || 0)
      : sum - (e.cash || 0);
  }, 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>💎 N.K Jewellers Ledger</h2>

      <input
        placeholder="Party Name"
        value={party}
        onChange={(e) => setParty(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="IN">IN (Aaya)</option>
        <option value="OUT">OUT (Gaya)</option>
      </select>

      <input
        placeholder="Gold"
        value={gold}
        onChange={(e) => setGold(e.target.value)}
      />

      <input
        placeholder="Cash"
        value={cash}
        onChange={(e) => setCash(e.target.value)}
      />

      <button onClick={addEntry}>Add Entry</button>

      <h3>Total Gold: {totalGold} g</h3>
      <h3>Total Cash: ₹ {totalCash}</h3>

      {entries.map((e) => (
        <div key={e.id} style={{ marginTop: 10, padding: 10, background: "#eee" }}>
          <b>{e.party_name}</b> ({e.type})
          <div>Gold: {e.gold}</div>
          <div>Cash: ₹ {e.cash}</div>
        </div>
      ))}
    </div>
  );
}