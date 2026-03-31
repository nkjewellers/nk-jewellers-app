"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://norfynjyeeqrqqcqjawp.supabase.co",
  "sb_publishable_CVSigeYJoONriiY2j0yXvg_hvU4d9ZM"
);

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [party, setParty] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gold, setGold] = useState("");
  const [cash, setCash] = useState("");

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

  async function saveEntry() {
    if (!party) return alert("Party name required");

    if (editingId) {
      await supabase
        .from("entries")
        .update({
          party_name: party,
          phone,
          address,
          gold,
          cash,
        })
        .eq("id", editingId);

      setEditingId(null);
    } else {
      await supabase.from("entries").insert([
        {
          party_name: party,
          phone,
          address,
          gold,
          cash,
        },
      ]);
    }

    setParty("");
    setPhone("");
    setAddress("");
    setGold("");
    setCash("");

    fetchEntries();
  }

  function editEntry(e) {
    setEditingId(e.id);
    setParty(e.party_name);
    setPhone(e.phone || "");
    setAddress(e.address || "");
    setGold(e.gold);
    setCash(e.cash);
  }

  async function deleteEntry(id) {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("entries").delete().eq("id", id);
    fetchEntries();
  }

  const totalGold = entries.reduce((s, e) => s + (e.gold || 0), 0);
  const totalCash = entries.reduce((s, e) => s + (e.cash || 0), 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>💎 N.K Jewellers Ledger</h2>

      <input placeholder="Party Name" value={party} onChange={(e) => setParty(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <input placeholder="Gold" value={gold} onChange={(e) => setGold(e.target.value)} />
      <input placeholder="Cash" value={cash} onChange={(e) => setCash(e.target.value)} />

      <button onClick={saveEntry}>
        {editingId ? "Update Entry" : "Add Entry"}
      </button>

      <h3>Total Gold: {totalGold} g</h3>
      <h3>Total Cash: ₹ {totalCash}</h3>

      <h3>Entries</h3>

      {entries.map((e) => (
        <div key={e.id} style={{ marginBottom: 10, padding: 10, background: "#f5f5f5" }}>
          
          {/* 🔥 CLICKABLE PARTY */}
          <a href={`/ledger?party=${e.party_name}`} style={{ color: "blue" }}>
            <b>{e.party_name}</b>
          </a>

          <div>📞 {e.phone || "-"}</div>
          <div>📍 {e.address || "-"}</div>
          <div>Gold: {e.gold} g</div>
          <div>Cash: ₹ {e.cash}</div>

          <button onClick={() => editEntry(e)}>✏️ Edit</button>
          <button onClick={() => deleteEntry(e.id)}>🗑 Delete</button>
        </div>
      ))}
    </div>
  );
}