import React, { memo, useState } from "react";
import axios from "axios";
import { getToken } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { Pencil, UserX, UserCheck, ChevronUp, ChevronDown } from "lucide-react";

function Avatar({ firstName, lastName }) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  const colors = [
    ["#EFF6FF", "#2563EB"],
    ["#F0FDF4", "#16A34A"],
    ["#FAF5FF", "#7C3AED"],
    ["#FFFBEB", "#D97706"],
    ["#FFF1F2", "#E11D48"],
    ["#ECFEFF", "#0891B2"],
  ];
  const idx = (firstName?.charCodeAt(0) ?? 0) % colors.length;
  const [bg, text] = colors[idx];
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: bg, color: text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, flexShrink: 0,
      border: `1.5px solid ${text}22`,
    }}>
      {initials || "?"}
    </div>
  );
}

const COLUMNS = [
  { key: "name",        label: "Employee",      sortable: true  },
  { key: "email",       label: "Email",         sortable: false },
  { key: "department",  label: "Department",    sortable: true  },
  { key: "designation", label: "Designation",   sortable: false },
  { key: "joiningDate", label: "Joined",        sortable: true  },
  { key: "active",      label: "Status",        sortable: true  },
  { key: "actions",     label: "Actions",       sortable: false },
];

function EmployeeTable({ employees = [], refreshData }) {
  const navigate = useNavigate();
  const token = getToken();
  const [loadingId, setLoadingId] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = [...employees].sort((a, b) => {
    if (!sortKey) return 0;
    let av = sortKey === "name" ? `${a.firstName} ${a.lastName}` : a[sortKey];
    let bv = sortKey === "name" ? `${b.firstName} ${b.lastName}` : b[sortKey];
    if (typeof av === "boolean") return sortDir === "asc" ? (av ? -1 : 1) : (av ? 1 : -1);
    return sortDir === "asc"
      ? String(av ?? "").localeCompare(String(bv ?? ""))
      : String(bv ?? "").localeCompare(String(av ?? ""));
  });

  const toggleStatus = async (e) => {
    setLoadingId(e.id);
    try {
      const endpoint = e.active ? "deactivate" : "reactivate";
      await axios.put(
        `http://localhost:8080/api/admin/employees/${endpoint}/${e.id}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    const active = sortKey === col.key;
    return (
      <span style={{ display: "inline-flex", flexDirection: "column", marginLeft: 4, verticalAlign: "middle", opacity: active ? 1 : 0.3 }}>
        <ChevronUp size={10} style={{ marginBottom: -3, color: active && sortDir === "asc" ? "#2563EB" : "#9CA3AF" }} />
        <ChevronDown size={10} style={{ color: active && sortDir === "desc" ? "#2563EB" : "#9CA3AF" }} />
      </span>
    );
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #F0F0F0",
      boxShadow: "0 1px 12px rgba(0,0,0,0.05)",
      overflow: "hidden",
      fontFamily: "inherit",
    }}>

      {/* Header */}
      <div style={{
        padding: "18px 20px 14px",
        borderBottom: "1px solid #F9FAFB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827", letterSpacing: "-0.2px" }}>
            Employee Management
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9CA3AF" }}>
            {employees.length} {employees.length === 1 ? "employee" : "employees"} shown
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/employees/new")}
          onMouseEnter={(e) => e.currentTarget.style.background = "#1D4ED8"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#2563EB"}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, color: "#fff",
            background: "#2563EB", border: "none",
            borderRadius: 8, padding: "7px 14px",
            cursor: "pointer", transition: "background 0.15s",
          }}
        >
          + Add Employee
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F0F0F0" }}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#6B7280",
                    letterSpacing: "0.4px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    cursor: col.sortable ? "pointer" : "default",
                    userSelect: "none",
                    borderBottom: "1px solid #F0F0F0",
                  }}
                >
                  {col.label}
                  <SortIcon col={col} />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "48px 20px", textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "#F9FAFB", border: "1px solid #E5E7EB",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20,
                    }}>
                      👤
                    </div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#374151" }}>No employees found</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>Try adjusting your filters or add a new employee</p>
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((e, i) => (
                <tr
                  key={e.id}
                  onMouseEnter={(el) => el.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={(el) => el.currentTarget.style.background = "transparent"}
                  style={{
                    borderBottom: i < sorted.length - 1 ? "1px solid #F9FAFB" : "none",
                    transition: "background 0.1s",
                  }}
                >
                  {/* Employee name + avatar */}
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar firstName={e.firstName} lastName={e.lastName} />
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: "#111827", fontSize: 12 }}>
                          {e.firstName} {e.lastName}
                        </p>
                        <p style={{ margin: 0, fontSize: 10, color: "#9CA3AF" }}>ID #{e.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: 12 }}>
                    {e.email}
                  </td>

                  {/* Department */}
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 500,
                      color: "#374151", background: "#F3F4F6",
                      border: "1px solid #E5E7EB",
                      borderRadius: 6, padding: "3px 8px",
                    }}>
                      {e.department?.name || e.department || "—"}
                    </span>
                  </td>

                  {/* Designation */}
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: 12, whiteSpace: "nowrap" }}>
                    {e.designation?.name || e.designation || "—"}
                  </td>

                  {/* Joining Date */}
                  <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: 12, whiteSpace: "nowrap" }}>
                    {e.joiningDate
                      ? new Date(e.joiningDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "—"}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 11, fontWeight: 600,
                      color: e.active ? "#059669" : "#DC2626",
                      background: e.active ? "#ECFDF5" : "#FEF2F2",
                      border: `1px solid ${e.active ? "#A7F3D0" : "#FECACA"}`,
                      borderRadius: 20, padding: "3px 10px",
                      whiteSpace: "nowrap",
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: e.active ? "#10B981" : "#EF4444",
                        display: "inline-block",
                      }} />
                      {e.active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/admin/employees/${e.id}/edit`)}
                        title="Edit employee"
                        onMouseEnter={(el) => el.currentTarget.style.background = "#DBEAFE"}
                        onMouseLeave={(el) => el.currentTarget.style.background = "#EFF6FF"}
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          fontSize: 11, fontWeight: 600,
                          color: "#2563EB", background: "#EFF6FF",
                          border: "1px solid #BFDBFE",
                          borderRadius: 7, padding: "5px 10px",
                          cursor: "pointer", transition: "background 0.15s",
                        }}
                      >
                        <Pencil size={12} strokeWidth={2} />
                        Edit
                      </button>

                      {/* Deactivate / Reactivate */}
                      <button
                        onClick={() => toggleStatus(e)}
                        disabled={loadingId === e.id}
                        title={e.active ? "Deactivate employee" : "Reactivate employee"}
                        onMouseEnter={(el) => {
                          if (loadingId !== e.id)
                            el.currentTarget.style.background = e.active ? "#FFE4E6" : "#DCFCE7";
                        }}
                        onMouseLeave={(el) => {
                          el.currentTarget.style.background = e.active ? "#FFF1F2" : "#F0FDF4";
                        }}
                        style={{
                          display: "flex", alignItems: "center", gap: 5,
                          fontSize: 11, fontWeight: 600,
                          color: e.active ? "#E11D48" : "#16A34A",
                          background: e.active ? "#FFF1F2" : "#F0FDF4",
                          border: `1px solid ${e.active ? "#FECDD3" : "#BBF7D0"}`,
                          borderRadius: 7, padding: "5px 10px",
                          cursor: loadingId === e.id ? "not-allowed" : "pointer",
                          opacity: loadingId === e.id ? 0.6 : 1,
                          transition: "background 0.15s",
                        }}
                      >
                        {e.active
                          ? <><UserX size={12} strokeWidth={2} /> Deactivate</>
                          : <><UserCheck size={12} strokeWidth={2} /> Reactivate</>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(EmployeeTable);