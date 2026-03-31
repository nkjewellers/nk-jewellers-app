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
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gold, setGold] = useState("");
  const [cash, setCash] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const { data } = await supabase.from("entries").select("*").order("created_at", { ascending: false });
    setEntries(data || []);
  }

  async function addEntry() {
    if (!party) return alert("Party name required");

    await supabase.from("entries").insert([
      {
        party_name: party,
        phone: phone || null,
        address: address || null,
        gold: Number(gold) || 0,
        cash: Number(cash) || 0,
      },
    ]);

    setParty("");
    setPhone("");
    setAddress("");
    setGold("");
    setCash("");

    fetchEntries();
  }

  const totalGold = entries.reduce((sum, e) => sum + (e.gold || 0), 0);
  const totalCash = entries.reduce((sum, e) => sum + (e.cash || 0), 0);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", background: "#f5f5f5", minHeight: "100vh" }}>
      <h2>💎 N.K Jewellers Ledger</h2>

      <input placeholder="Party Name *" value={party} onChange={(e) => setParty(e.target.value)} style={inputStyle} />
      <input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
      <input placeholder="Address (optional)" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
      <input placeholder="Gold (grams)" value={gold} onChange={(e) => setGold(e.target.value)} style={inputStyle} />
      <input placeholder="Cash (₹)" value={cash} onChange={(e) => setCash(e.target.value)} style={inputStyle} />

      <button onClick={addEntry} style={btnStyle}>➕ Add Entry</button>

      <div style={{ marginTop: 20 }}>
        <div style={cardStyle}>Total Gold: {totalGold} g</div>
        <div style={cardStyle}>Total Cash: ₹ {totalCash}</div>
      </div>

      <h3 style={{ marginTop: 20 }}>Entries</h3>

      {entries.map((e) => (
        <div key={e.id} style={entryStyle}>
          <b>{e.party_name}</b><br />
          {e.phone && <>📞 {e.phone}<br /></>}
          {e.address && <>📍 {e.address}<br /></>}
          Gold: {e.gold} g | Cash: ₹ {e.cash}
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  display: "block",
  marginBottom: 10,
  padding: 10,
  width: "100%",
  maxWidth: 400,
  border: "1px solid #ccc",
  borderRadius: 5,
  color: "#000",
  background: "#fff"
};

const btnStyle = {
  padding: 10,
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  cursor: "pointer"
};

const cardStyle = {
  display: "inline-block",
  marginRight: 10,
  padding: 10,
  background: "#fff",
  borderRadius: 5
};

const entryStyle = {
  background: "#fff",
  padding: 10,
  marginTop: 10,
  borderRadius: 5
};