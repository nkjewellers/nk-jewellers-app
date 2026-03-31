"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [gold, setGold] = useState("");
  const [cash, setCash] = useState("");

  // LOAD DATA
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ledger");
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch (e) {
      console.log("Load error", e);
    }
  }, []);

  // ADD ENTRY
  const add = () => {
    if (!name) return;

    const newEntry = {
      id: Date.now(),
      name,
      gold: Number(gold),
      cash: Number(cash),
    };

    setData((prev) => {
      const updated = [...prev, newEntry];

      // ✅ SAVE CORRECT DATA
      localStorage.setItem("ledger", JSON.stringify(updated));

      return updated;
    });

    setName("");
    setGold("");
    setCash("");
  };

  // DELETE ENTRY
  const del = (id) => {
    setData((prev) => {
      const updated = prev.filter((item) => item.id !== id);

      // ✅ SAVE AFTER DELETE
      localStorage.setItem("ledger", JSON.stringify(updated));

      return updated;
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>New N.K Jewellers Ledger</h1>

      <input
        placeholder="Party Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Gold (grams)"
        value={gold}
        onChange={(e) => setGold(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Cash (₹)"
        value={cash}
        onChange={(e) => setCash(e.target.value)}
      />
      <br /><br />

      <button onClick={add}>Add Entry</button>

      <h2>Entries:</h2>

      {data.length === 0 && <p>No entries yet</p>}

      {data.map((item) => (
        <div key={item.id}>
          {item.name} | Gold: {item.gold}g | ₹ {item.cash}
          <button onClick={() => del(item.id)}> ❌ </button>
        </div>
      ))}
    </div>
  );
}