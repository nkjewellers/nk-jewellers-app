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

  async function saveEntry() {
    if (!party) return alert("Enter party name");

    // 🔍 same party + phone + address
    const existing = entries.find(
      (e) =>
        e.party_name.toLowerCase() === party.toLowerCase() &&
        (e.phone || "") === (phone || "") &&
        (e.address || "") === (address || "")
    );

    // 🔥 MERGE LOGIC
    if (!editingId && existing) {
      const merge = confirm("Same party found. Merge entries?");
      if (merge) {
        const newGold =
          type === "IN"
            ? (existing.gold || 0) + Number(gold || 0)
            : (existing.gold || 0) - Number(gold || 0);

        const newCash =
          type === "IN"
            ? (existing.cash || 0) + Number(cash || 0)
            : (existing.cash || 0) - Number(cash || 0);

        await supabase
          .from("entries")
          .update({ gold: newGold, cash: newCash })
          .eq("id", existing.id);

        clearForm();
        fetchEntries();
        return;
      }
    }

    if (editingId) {
      // ✏️ UPDATE
      await supabase
        .from("entries")
        .update({
          party_name: party,
          phone,
          address,
          gold,
          cash,
          type,
        })
        .eq("id", editingId);

      setEditingId(null);
    } else {
      // ➕ INSERT
      await supabase.from("entries").insert([
        {
          party_name: party,
          phone,
          address,
          gold,
          cash,
          type,
        },
      ]);
    }

    clearForm();
    fetchEntries();
  }

  function editEntry(e) {
    setEditingId(e.id);
    setParty(e.party_name);
    setPhone(e.phone || "");
    setAddress(e.address || "");
    setGold(e.gold);
    setCash(e.cash);
    setType(e.type || "IN");
  }

  async function deleteEntry(id) {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("entries").delete().eq("id", id);
    fetchEntries();
  }

  function clearForm() {
    setParty("");
    setPhone("");
    setAddress("");
    setGold("");
    setCash("");
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

      <input placeholder="Party Name" value={party} onChange={(e) => setParty(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="IN">IN (Aaya)</option>
        <option value="OUT">OUT (Gaya)</option>
      </select>

      <input placeholder="Gold" value={gold} onChange={(e) => setGold(e.target.value)} />
      <input placeholder="Cash" value={cash} onChange={(e) => setCash(e.target.value)} />

      <button onClick={saveEntry}>
        {editingId ? "Update Entry" : "Add Entry"}
      </button>

      <h3>Total Gold: {totalGold} g</h3>
      <h3>Total Cash: ₹ {totalCash}</h3>

      {entries.map((e) => (
        <div key={e.id} style={{ marginTop: 10, padding: 10, background: "#eee" }}>
          <b>{e.party_name}</b>
          <div>📞 {e.phone || "-"}</div>
          <div>📍 {e.address || "-"}</div>
          <div>Type: {e.type}</div>
          <div>Gold: {e.gold}</div>
          <div>Cash: ₹ {e.cash}</div>

          <button onClick={() => editEntry(e)}>✏️ Edit</button>
          <button onClick={() => deleteEntry(e.id)}>🗑 Delete</button>
        </div>
      ))}
    </div>
  );
}