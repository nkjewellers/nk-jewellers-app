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

  async function fetchData() {
    const { data } = await supabase
      .from("entries")
      .select("*")
      .order("created_at", { ascending: false });

    setEntries(data || []);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function addEntry() {
    if (!party) return alert("Enter party name");

    await supabase.from("entries").insert([
      { party_name: party, gold, cash },
    ]);

    setParty("");
    setGold("");
    setCash("");
    fetchData();
  }

  async function deleteEntry(id) {
    await supabase.from("entries").delete().eq("id", id);
    fetchData();
  }

  async function editEntry(entry) {
    const newParty = prompt("Edit Party Name", entry.party_name);
    const newGold = prompt("Edit Gold", entry.gold);
    const newCash = prompt("Edit Cash", entry.cash);

    if (!newParty) return;

    await supabase
      .from("entries")
      .update({
        party_name: newParty,
        gold: newGold,
        cash: newCash,
      })
      .eq("id", entry.id);

    fetchData();
  }

  const totalGold = entries.reduce((sum, e) => sum + Number(e.gold || 0), 0);
  const totalCash = entries.reduce((sum, e) => sum + Number(e.cash || 0), 0);

  return (
    <div style={container}>
      <h2 style={{ textAlign: "center" }}>💎 N.K Jewellers Ledger</h2>

      <input
        placeholder="Party Name"
        value={party}
        onChange={(e) => setParty(e.target.value)}
        style={input}
      />

      <input
        placeholder="Gold (grams)"
        value={gold}
        onChange={(e) => setGold(e.target.value)}
        style={input}
      />

      <input
        placeholder="Cash (₹)"
        value={cash}
        onChange={(e) => setCash(e.target.value)}
        style={input}
      />

      <button onClick={addEntry} style={button}>
        ➕ Add Entry
      </button>

      {/* Totals */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <div style={goldBox}>Total Gold: {totalGold} g</div>
        <div style={cashBox}>Total Cash: ₹ {totalCash}</div>
      </div>

      <h3>Entries</h3>

      {entries.map((e) => (
        <div key={e.id} style={card}>
          <b>{e.party_name}</b>
          <div>Gold: {e.gold} g</div>
          <div>Cash: ₹{e.cash}</div>

          <div style={{ marginTop: "8px" }}>
            <button onClick={() => editEntry(e)} style={editBtn}>
              ✏️ Edit
            </button>

            <button onClick={() => deleteEntry(e.id)} style={deleteBtn}>
              ❌ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* styles */

const container = {
  maxWidth: "500px",
  margin: "auto",
  padding: "20px",
  fontFamily: "Arial",
  backgroundColor: "#ffffff",
  color: "#000000",
  minHeight: "100vh",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  color: "#000",
  backgroundColor: "#fff",
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  marginBottom: "20px",
};

const card = {
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  background: "#f5f5f5",
};

const editBtn = {
  padding: "6px 10px",
  marginRight: "10px",
  border: "none",
  borderRadius: "6px",
  background: "#007bff",
  color: "#fff",
};

const deleteBtn = {
  padding: "6px 10px",
  border: "none",
  borderRadius: "6px",
  background: "red",
  color: "#fff",
};

const goldBox = {
  padding: "10px",
  background: "#d4f1ff",
  borderRadius: "8px",
};

const cashBox = {
  padding: "10px",
  background: "#ffe8c2",
  borderRadius: "8px",
};