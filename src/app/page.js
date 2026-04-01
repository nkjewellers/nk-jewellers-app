"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import jsPDF from "jspdf";
import Link from "next/link"; // ✅ clickable

const supabase = createClient(
  "https://norfynjyeeqrqqcqjawp.supabase.co",
  "sb_publishable_CVSigeYJoONriiY2j0yXvg_hvU4d9ZM"
);

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    party_name: "",
    gold: "",
    cash: "",
    phone: "",
    address: "",
    note: "",
  });

  const [goldType, setGoldType] = useState("in");
  const [cashType, setCashType] = useState("in");
  const [editId, setEditId] = useState(null);

  const fetchEntries = async () => {
    const { data } = await supabase.from("entries").select("*");
    setEntries(data || []);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async () => {
    if (!form.party_name) return alert("Party name required");

    let gold = Number(form.gold) || 0;
    let cash = Number(form.cash) || 0;

    if (goldType === "out") gold = -gold;
    if (cashType === "out") cash = -cash;

    if (editId) {
      await supabase
        .from("entries")
        .update({ ...form, gold, cash })
        .eq("id", editId);
      setEditId(null);
    } else {
      await supabase.from("entries").insert([{ ...form, gold, cash }]);
    }

    setForm({
      party_name: "",
      gold: "",
      cash: "",
      phone: "",
      address: "",
      note: "",
    });

    fetchEntries();
  };

  const deleteEntry = async (id) => {
    await supabase.from("entries").delete().eq("id", id);
    fetchEntries();
  };

  const editEntry = (e) => {
    setForm(e);
    setEditId(e.id);
  };

  // totals
  const partyTotals = {};
  entries.forEach((e) => {
    const name = e.party_name;
    if (!partyTotals[name]) partyTotals[name] = { gold: 0, cash: 0 };
    partyTotals[name].gold += Number(e.gold || 0);
    partyTotals[name].cash += Number(e.cash || 0);
  });

  // PDF
  const downloadPDF = (name) => {
    const doc = new jsPDF();
    const partyEntries = entries.filter((e) => e.party_name === name);

    let totalGold = 0;
    let totalCash = 0;

    partyEntries.forEach((e) => {
      totalGold += Number(e.gold || 0);
      totalCash += Number(e.cash || 0);
    });

    doc.text("N.K Jewellers Ledger", 10, 10);
    doc.text(`Party: ${name}`, 10, 20);
    doc.text(`Gold: ${totalGold} g`, 10, 30);
    doc.text(`Cash: ₹ ${totalCash}`, 10, 40);

    let y = 50;

    partyEntries.forEach((e, i) => {
      const line = `${i + 1}. Gold: ${e.gold} | Cash: ₹ ${e.cash} ${e.note || ""}`;
      const split = doc.splitTextToSize(line, 180);
      doc.text(split, 10, y);
      y += split.length * 8;
    });

    doc.save(`${name}.pdf`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💎 N.K Jewellers Ledger</h2>

      <input placeholder="Party Name" value={form.party_name}
        onChange={(e) => setForm({ ...form, party_name: e.target.value })} />

      <input placeholder="Phone" value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })} />

      <input placeholder="Address" value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })} />

      <select value={goldType} onChange={(e) => setGoldType(e.target.value)}>
        <option value="in">Gold Aaya</option>
        <option value="out">Gold Gaya</option>
      </select>

      <input placeholder="Gold" value={form.gold}
        onChange={(e) => setForm({ ...form, gold: e.target.value })} />

      <select value={cashType} onChange={(e) => setCashType(e.target.value)}>
        <option value="in">Cash Aaya</option>
        <option value="out">Cash Gaya</option>
      </select>

      <input placeholder="Cash" value={form.cash}
        onChange={(e) => setForm({ ...form, cash: e.target.value })} />

      <input placeholder="Note" value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })} />

      <button onClick={handleSubmit}>
        {editId ? "Update" : "Add Entry"}
      </button>

      <h3>Party Balances</h3>

      {Object.entries(partyTotals).map(([name, data]) => (
        <div key={name} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>

          {/* ✅ CLICKABLE NAME */}
          <Link href={`/party/${name}`}>
            <b style={{ color: "blue", cursor: "pointer" }}>{name}</b>
          </Link>

          <div>Gold: {data.gold} g</div>
          <div style={{ color: data.cash >= 0 ? "green" : "red" }}>
            Cash: ₹ {data.cash}
          </div>

          <button onClick={() => downloadPDF(name)}>📄 PDF</button>
        </div>
      ))}

      <h3>All Entries</h3>

      {entries.map((e) => (
        <div key={e.id} style={{ border: "1px solid #ddd", padding: 10, marginTop: 10 }}>
          <b>{e.party_name}</b>
          <div>Gold: {e.gold} | Cash: ₹ {e.cash}</div>
          {e.note && <div>📝 {e.note}</div>}

          <button onClick={() => editEntry(e)}>Edit</button>
          <button onClick={() => deleteEntry(e.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}