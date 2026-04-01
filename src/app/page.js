const handleSubmit = async () => {
  if (!form.party_name) return alert("Party name required");

  const gold = Number(form.gold) || 0;
  const cash = Number(form.cash) || 0;

  // 🔍 SAME PARTY CHECK (FIXED LOGIC)
  const existing = entries.find(
    (e) =>
      e.party_name.toLowerCase() === form.party_name.toLowerCase() &&
      (e.phone || "") === (form.phone || "")
  );

  // ✏ EDIT MODE
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

  // 🔁 MERGE MODE
  else if (existing) {
    const confirmMerge = confirm(
      "Same party found. Merge entries?"
    );

    if (confirmMerge) {
      await supabase
        .from("entries")
        .update({
          gold: existing.gold + gold,
          cash: existing.cash + cash,
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("entries").insert([
        {
          ...form,
          gold,
          cash,
        },
      ]);
    }
  }

  // ➕ NEW ENTRY
  else {
    await supabase.from("entries").insert([
      {
        ...form,
        gold,
        cash,
      },
    ]);
  }

  // 🔄 Reset form
  setForm({
    party_name: "",
    gold: "",
    cash: "",
    phone: "",
    address: "",
  });

  fetchEntries();
};