"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔑 Supabase config
const supabase = createClient(
  "https://norfynjyeeqrqqcqjawp.supabase.co",
  "sb_publishable_CVSigeYJoONriiY2j0yXvg_hvU4d9ZM"
);

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [gold, setGold] = useState("");
  const [cash, setCash] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // 📥 Fetch data
  const fetchEntries = async () => {
    const { data } = await supabase.from("entries").select("*");
    setEntries(data || []);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // ➕ Add entry
  const addEntry = async () => {
    if (!partyName) return alert("Party name required");

    await supabase.from("entries").insert([
      {
        party_name: partyName,
        gold: Number(gold) || 0,
        cash: Number(cash) || 0,
        phone: phone || null,
        address: address || null,
      },
    ]);

    setPartyName("");
    setGold("");
    setCash("");
    setPhone("");
    setAddress("");

    fetchEntries();
  };

  // ❌ Delete entry
  const deleteEntry = async (id) => {
    await supabase.from("entries").delete().eq("id", id);
    fetchEntries();
  };

  // 💰 Totals
  const totalGold = entries.reduce((sum, e) => sum + (e.gold || 0), 0);
  const totalCash = entries.reduce((sum, e) => sum + (e.cash || 0), 0);

  return (
    <div
      style={{
        padding: 20,
        backgroundColor: "#ffffff",
        color: "#000000",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      <h2>💎 N.K Jewellers Ledger</h2>

      {/* Form */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Party Name"
          value={partyName}
          onChange={(e) => setPartyName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Gold (grams)"
          value={gold}
          onChange={(e) => setGold(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Cash (₹)"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          style={inputStyle}
        />

        <button onClick={addEntry} style={btnStyle}>
          ➕ Add Entry
        </button>
      </div>

      {/* Totals */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={goldBox}>Total Gold: {totalGold} g</div>
        <div style={cashBox}>Total Cash: ₹ {totalCash}</div>
      </div>

      {/* Entries */}
      <h3>Entries</h3>

      {entries.map((e) => (
        <div key={e.id} style={card}>
          <b>{e.party_name}</b>

          <div>Gold: {e.gold} g | Cash: ₹ {e.cash}</div>

          {e.phone && <div>📞 {e.phone}</div>}
          {e.address && <div>📍 {e.address}</div>}

          <button onClick={() => deleteEntry(e.id)} style={deleteBtn}>
            ❌ Delete
          </button>
        </div>
      ))}
    </div>
  );
}

// 🎨 Styles
const inputStyle = {
  display: "block",
  marginBottom: 10,
  padding: 10,
  width: "100%",
  maxWidth: 300,
  border: "1px solid #ccc",
  color: "#000",
};

const btnStyle = {
  padding: 10,
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const deleteBtn = {
  marginTop: 10,
  background: "red",
  color: "#fff",
  border: "none",
  padding: 5,
  cursor: "pointer",
};

const card = {
  border: "1px solid #ddd",
  padding: 10,
  marginBottom: 10,
  borderRadius: 5,
};

const goldBox = {
  padding: 10,
  background: "#d4f5d4",
  borderRadius: 5,
};

const cashBox = {
  padding: 10,
  background: "#f5e1c8",
  borderRadius: 5,
};