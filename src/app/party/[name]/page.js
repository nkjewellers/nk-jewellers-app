"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import jsPDF from "jspdf"; // ✅ PDF

const supabase = createClient(
  "https://norfynjyeeqrqqcqjawp.supabase.co",
  "sb_publishable_CVSigeYJoONriiY2j0yXvg_hvU4d9ZM"
);

export default function PartyPage() {
  const { name } = useParams();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("party_name", name);

    setEntries(data || []);
  };

  let totalGold = 0;
  let totalCash = 0;

  entries.forEach((e) => {
    totalGold += Number(e.gold || 0);
    totalCash += Number(e.cash || 0);
  });

  // 🔥 PDF FUNCTION
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("N.K Jewellers Ledger", 10, 10);
    doc.text(`Party: ${name}`, 10, 20);
    doc.text(`Gold: ${totalGold} g`, 10, 30);
    doc.text(`Cash: ₹ ${totalCash}`, 10, 40);

    let y = 50;

    entries.forEach((e, i) => {
      const line = `${i + 1}. Gold: ${e.gold} | Cash: ₹ ${e.cash} ${e.note || ""}`;
      const split = doc.splitTextToSize(line, 180);

      doc.text(split, 10, y);
      y += split.length * 8;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${name}_ledger.pdf`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💎 Party: {name}</h2>

      <h3>Gold: {totalGold} g</h3>

      <h3 style={{ color: totalCash >= 0 ? "green" : "red" }}>
        Cash: ₹ {totalCash}
      </h3>

      {/* ✅ PDF BUTTON */}
      <button onClick={downloadPDF} style={{ marginTop: 10 }}>
        📄 Download PDF
      </button>

      <h3 style={{ marginTop: 20 }}>Entries</h3>

      {entries.map((e) => (
        <div key={e.id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <div>
            Gold: {e.gold} | Cash: ₹ {e.cash}
          </div>

          {e.note && <div>📝 {e.note}</div>}
        </div>
      ))}
    </div>
  );
}