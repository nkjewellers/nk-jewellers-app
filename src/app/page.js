"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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

    // IN / OUT logic
    if (goldType === "out") gold = -gold;
    if (cashType === "out") cash = -cash;

    const existing = entries.find(
      (e) =>
        e.party_name.toLowerCase() === form.party_name.toLowerCase() &&
        (e.phone || "") === (form.phone || "")
    );

    // ✏ EDIT
    if (editId) {
      await supabase
        .from("entries")
        .update({
          ...form,
          gold,
          cash,
        })
        .eq("id", editId);

      setEditId(null);
    }

    // 🔁 MERGE (FINAL FIXED)
    else if (existing) {
      const confirmMerge = confirm("Same party found. Merge?");

      if (confirmMerge) {
        // 🔥 fresh DB fetch
        const { data: fresh } = await supabase
          .from("entries")
          .select("*")
          .eq("id", existing.id)
          .single();

        const updatedGold =
          Number(fresh.gold || 0) + gold;

        const updatedCash =
          Number(fresh.cash || 0) + cash;

        await supabase
          .from("entries")
          .update({
            gold: updatedGold,
            cash: updatedCash,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("entries").insert([
          { ...form, gold, cash },
        ]);
      }
    }

    // ➕ NEW
    else {
      await supabase.from("entries").insert([
        { ...form, gold, cash },
      ]);
    }

    // reset
    setForm({
      party_name: "",
      gold: "",
      cash: "",
      phone: "",
      address: "",
    });

    setGoldType("in");
    setCashType("in");

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

  const totalGold = entries.reduce(
    (s, e) => s + Number(e.gold || 0),
    0
  );

  const totalCash = entries.reduce(
    (s, e) => s + Number(e.cash || 0),
    0
  );

  return (
    <div style={container}>
      <h2>💎 N.K Jewellers Ledger</h2>

      {/* FORM */}
      <input
        placeholder="Party Name"
        value={form.party_name}
        onChange={(e) =>
          setForm({ ...form, party_name: e.target.value })
        }
        style={input}
      />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
        style={input}
      />

      <input
        placeholder="Address"
        value={form.address}
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
        style={input}
      />

      {/* GOLD */}
      <select
        value={goldType}
        onChange={(e) => setGoldType(e.target.value)}
        style={input}
      >
        <option value="in">Gold Aaya</option>
        <option value="out">Gold Gaya</option>
      </select>

      <input
        placeholder="Gold"
        value={form.gold}
        onChange={(e) =>
          setForm({ ...form, gold: e.target.value })
        }
        style={input}
      />

      {/* CASH */}
      <select
        value={cashType}
        onChange={(e) => setCashType(e.target.value)}
        style={input}
      >
        <option value="in">Cash Aaya</option>
        <option value="out">Cash Gaya</option>
      </select>

      <input
        placeholder="Cash"
        value={form.cash}
        onChange={(e) =>
          setForm({ ...form, cash: e.target.value })
        }
        style={input}
      />

      <button onClick={handleSubmit} style={btn}>
        {editId ? "Update Entry" : "Add Entry"}
      </button>

      {/* TOTAL */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <div style={box}>Gold: {totalGold} g</div>
        <div style={box}>Cash: ₹ {totalCash}</div>
      </div>

      {/* LIST */}
      <h3 style={{ marginTop: 20 }}>Entries</h3>

      {entries.map((e) => (
        <div key={e.id} style={card}>
          <b>{e.party_name}</b>

          <div>
            Gold: {e.gold} g | Cash: ₹ {e.cash}
          </div>

          {e.phone && <div>📞 {e.phone}</div>}
          {e.address && <div>📍 {e.address}</div>}

          <div style={{ marginTop: 5 }}>
            <button onClick={() => editEntry(e)}>✏ Edit</button>
            <button
              onClick={() => deleteEntry(e.id)}
              style={{ marginLeft: 10, color: "red" }}
            >
              ❌ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// styles
const container = {
  padding: 20,
  background: "#ffffff",
  color: "#000000",
  minHeight: "100vh",
};

const input = {
  display: "block",
  marginBottom: 10,
  padding: 10,
  width: "100%",
  maxWidth: 300,
  color: "#000",
};

const btn = {
  padding: 10,
  background: "green",
  color: "#fff",
};

const card = {
  border: "1px solid #ddd",
  padding: 10,
  marginTop: 10,
};

const box = {
  padding: 10,
  background: "#eee",
};