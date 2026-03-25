import React, { useState } from "react";
import { Trash2, Pencil, ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";

const PAGE_SIZE = 12;

const UserTable = ({ data, onDelete, handleEdit }) => {
  const [search,   setSearch]   = useState("");
  const [sortKey,  setSortKey]  = useState(null);
  const [sortDir,  setSortDir]  = useState("asc");
  const [selected, setSelected] = useState(new Set());
  const [page,     setPage]     = useState(1);

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem", color: "rgba(148,163,184,0.35)" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📭</div>
        <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "rgba(148,163,184,0.5)" }}>No records found</p>
        <p style={{ fontSize: "0.8rem", marginTop: "0.3rem" }}>Add a new entry using the button above.</p>
      </div>
    );
  }

  const EXCLUDE = ["_id", "__v", "password", "user"];
  const safeData = Array.isArray(data) ? data : [];

const headers = Array.from(
  new Set(
    safeData.flatMap((item) => Object.keys(item))
  )
).filter((k) => !EXCLUDE.includes(k));

  /* search */
  const searched = safeData.filter(row =>
    headers.some(h => String(row[h] ?? "").toLowerCase().includes(search.toLowerCase()))
  );

  /* sort */
  const sorted = sortKey
    ? [...searched].sort((a, b) => {
        const av = String(a[sortKey] ?? "").toLowerCase();
        const bv = String(b[sortKey] ?? "").toLowerCase();
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : searched;

  /* paginate */
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const allChecked = paged.length > 0 && paged.every(r => selected.has(r._id));
  const toggleAll  = () => {
    const next = new Set(selected);
    allChecked ? paged.forEach(r => next.delete(r._id)) : paged.forEach(r => next.add(r._id));
    setSelected(next);
  };
  const toggleOne  = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const truncate = (val, max = 30) => {
    const s = typeof val === "object" ? JSON.stringify(val) : String(val ?? "—");
    return s.length > max ? s.slice(0, max) + "…" : s;
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronsUpDown size={12} style={{ opacity: 0.25 }} />;
    return sortDir === "asc"
      ? <ChevronUp size={12} style={{ color: "#818cf8" }} />
      : <ChevronDown size={12} style={{ color: "#818cf8" }} />;
  };

  const base = { fontFamily: "'Inter', sans-serif", fontSize: "0.82rem" };

  return (
    <div style={base}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 320 }}>
          <Search size={13} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.3)", pointerEvents: "none" }} />
          <input
            placeholder="Search records…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 9, padding: "0.52rem 0.875rem 0.52rem 2.1rem",
              color: "#e2e8f0", fontSize: "0.8rem", outline: "none",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
          />
        </div>
        <span style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.35)", fontWeight: 500 }}>
          {searched.length} of {data.length} record{data.length !== 1 ? "s" : ""}
          {selected.size > 0 && <span style={{ color: "#818cf8", fontWeight: 700, marginLeft: "0.5rem" }}>· {selected.size} selected</span>}
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(6,6,14,0.6)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", color: "#cbd5e1" }}>
          <thead style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <tr>
              <th style={{ padding: "0.75rem 1rem", width: 40 }}>
                <input type="checkbox" style={{ accentColor: "#6366f1", cursor: "pointer" }} checked={allChecked} onChange={toggleAll} />
              </th>
              <th style={{ padding: "0.75rem 0.5rem", width: 44, textAlign: "left", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(148,163,184,0.45)" }}>#</th>
              {headers.map(h => (
                <th key={h} onClick={() => toggleSort(h)} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(148,163,184,0.55)", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    {h.replace(/_/g, " ")} <SortIcon col={h} />
                  </span>
                </th>
              ))}
              <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(148,163,184,0.45)" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paged.map((item, idx) => {
              const rowNum    = (page - 1) * PAGE_SIZE + idx + 1;
              const isSelected = selected.has(item._id);

              return (
                <Row
                  key={item._id || idx}
                  item={item}
                  rowNum={rowNum}
                  headers={headers}
                  isSelected={isSelected}
                  toggleOne={toggleOne}
                  truncate={truncate}
                  handleEdit={handleEdit}
                  onDelete={onDelete}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.75rem", color: "rgba(148,163,184,0.35)" }}>
            Page {page} of {totalPages} · {sorted.length} total
          </span>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            {[
              { label: "«", action: () => setPage(1),          disabled: page === 1 },
              { label: "‹", action: () => setPage(p => p - 1), disabled: page === 1 },
            ].map(({ label, action, disabled }) => (
              <PageBtn key={label} label={label} onClick={action} disabled={disabled} active={false} />
            ))}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.min(Math.max(page - 2, 1) + i, totalPages);
              return <PageBtn key={p} label={p} onClick={() => setPage(p)} active={p === page} />;
            })}
            {[
              { label: "›", action: () => setPage(p => p + 1), disabled: page === totalPages },
              { label: "»", action: () => setPage(totalPages),  disabled: page === totalPages },
            ].map(({ label, action, disabled }) => (
              <PageBtn key={label} label={label} onClick={action} disabled={disabled} active={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Row component (separate so hooks are valid) ── */
const Row = ({ item, rowNum, headers, isSelected, toggleOne, truncate, handleEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  const tdStyle = {
    padding: "0.72rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    verticalAlign: "middle", maxWidth: 200,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
    transition: "background 0.12s",
  };

  const rowBg = isSelected
    ? "rgba(99,102,241,0.1)"
    : hovered
      ? "rgba(99,102,241,0.06)"
      : rowNum % 2 === 0 ? "rgba(255,255,255,0.012)" : "transparent";

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: rowBg, transition: "background 0.12s" }}
    >
      <td style={{ ...tdStyle, width: 40 }}>
        <input type="checkbox" style={{ accentColor: "#6366f1", cursor: "pointer" }} checked={isSelected} onChange={() => toggleOne(item._id)} />
      </td>
      <td style={{ ...tdStyle, color: "rgba(148,163,184,0.25)", fontWeight: 500, width: 44 }}>{rowNum}</td>

      {headers.map(h => {
        const raw = item[h];
        const isBool = typeof raw === "boolean";
        const isDate = (h.toLowerCase().includes("at") || h.toLowerCase().includes("date")) && raw;
        return (
          <td key={h} style={tdStyle} title={typeof raw === "object" ? JSON.stringify(raw) : String(raw ?? "")}>
            {isBool ? (
              <span style={{
                display: "inline-block", padding: "0.12rem 0.5rem", borderRadius: 100,
                fontSize: "0.68rem", fontWeight: 700,
                background: raw ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.1)",
                color: raw ? "#34d399" : "#f87171",
              }}>
                {raw ? "true" : "false"}
              </span>
            ) : isDate ? (
              <span style={{ color: "rgba(148,163,184,0.55)", fontSize: "0.76rem" }}>
                {new Date(raw).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            ) : (
              truncate(raw)
            )}
          </td>
        );
      })}

      <td style={{ ...tdStyle, textAlign: "center" }}>
        <div style={{ display: "inline-flex", gap: "0.4rem" }}>
          <button
            onClick={() => handleEdit(item)}
            style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              padding: "0.32rem 0.65rem", borderRadius: 6,
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.28)",
              color: "#a5b4fc", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.12)"}
          >
            <Pencil size={11} />Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              padding: "0.32rem 0.65rem", borderRadius: 6,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.28)",
              color: "#f87171", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
          >
            <Trash2 size={11} />Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

const PageBtn = ({ label, onClick, disabled, active }) => (
  <button
    onClick={onClick} disabled={disabled}
    style={{
      minWidth: 30, height: 30, borderRadius: 7, cursor: disabled ? "default" : "pointer",
      border: active ? "1px solid #6366f1" : "1px solid rgba(255,255,255,0.08)",
      background: active ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
      color: active ? "#818cf8" : "rgba(148,163,184,0.4)",
      fontWeight: active ? 700 : 400, fontSize: "0.78rem",
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: disabled ? 0.35 : 1, transition: "all 0.15s",
    }}
  >
    {label}
  </button>
);

export default UserTable;
