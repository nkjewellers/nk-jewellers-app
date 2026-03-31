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
      // UPDATE
      await supabase
        .from("entries")
        .update({
          party_name: party,
          phone: phone || null,
          address: address || null,
          gold: Number(gold) || 0,
          cash: Number(cash) || 0,
        })
        .eq("id", editingId);

      setEditingId(null);
    } else {
      // INSERT
      await supabase.from("entries").insert([
        {
          party_name: party,
          phone: phone || null,
          address: address || null,
          gold: Number(gold) || 0,
          cash: Number(cash) || 0,
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

  const totalGold = entries.reduce((s, e) => s + (e.gold || 0), 0);
  const totalCash = entries.reduce((s, e) => s + (e.cash || 0), 0);

  return (
    <div style={{ padding: 20, background: "#f5f5f5", minHeight: "100vh" }}>
      <h2>💎 N.K Jewellers Ledger</h2>

      <input placeholder="Party Name *" value={party} onChange={(e) => setParty(e.target.value)} style={input} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={input} />
      <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} style={input} />
      <input placeholder="Gold" value={gold} onChange={(e) => setGold(e.target.value)} style={input} />
      <input placeholder="Cash" value={cash} onChange={(e) => setCash(e.target.value)} style={input} />

      <button onClick={saveEntry} style={btn}>
        {editingId ? "Update Entry" : "Add Entry"}
      </button>

      <div style={{ marginTop: 20 }}>
        <div style={card}>Total Gold: {totalGold} g</div>
        <div style={card}>Total Cash: ₹ {totalCash}</div>
      </div>

      <h3 style={{ marginTop: 20 }}>Entries</h3>

      {entries.map((e) => (
        <div key={e.id} style={entry}>
          <b>{e.party_name}</b><br />
          {e.phone && <>📞 {e.phone}<br /></>}
          {e.address && <>📍 {e.address}<br /></>}
          Gold: {e.gold} g | Cash: ₹ {e.cash}

          <div style={{ marginTop: 10 }}>
            <button onClick={() => editEntry(e)} style={editBtn}>✏️ Edit</button>
            <button onClick={() => deleteEntry(e.id)} style={delBtn}>🗑 Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const input = {
  display: "block",
  marginBottom: 10,
  padding: 10,
  width: "100%",
  maxWidth: 400,
  background: "#fff",
  color: "#000",
  border: "1px solid #ccc",
  borderRadius: 5
};

const btn = {
  padding: 10,
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: 5
};

const card = {
  display: "inline-block",
  marginRight: 10,
  padding: 10,
  background: "#fff",
  borderRadius: 5
};

const entry = {
  background: "#fff",
  padding: 10,
  marginTop: 10,
  borderRadius: 5
};

const editBtn = {
  marginRight: 10,
  padding: 6,
  background: "#2196F3",
  color: "#fff",
  border: "none",
  borderRadius: 4
};

const delBtn = {
  padding: 6,
  background: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: 4
};