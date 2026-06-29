import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible);
    if (end - start < maxVisible) start = Math.max(0, end - maxVisible);
    for (let i = start; i < end; i++) pages.push(i);
    return pages;
  };

  const pages = getPages();
  const isFirst = currentPage === 0;
  const isLast = currentPage === totalPages - 1;

  const btnBase = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minWidth: 34, height: 34, borderRadius: 8,
    fontSize: 12, fontWeight: 500,
    border: "1px solid #E5E7EB",
    background: "#fff", color: "#374151",
    cursor: "pointer", transition: "all 0.15s ease",
    padding: "0 6px",
  };

  const btnDisabled = {
    ...btnBase,
    opacity: 0.35, cursor: "not-allowed",
    background: "#F9FAFB", color: "#9CA3AF",
  };

  const btnActive = {
    ...btnBase,
    background: "#2563EB", color: "#fff",
    border: "1px solid #2563EB",
    fontWeight: 700, boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
  };

  const NavBtn = ({ onClick, disabled, children, title }) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={disabled ? btnDisabled : btnBase}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = "#F3F4F6"; e.currentTarget.style.borderColor = "#D1D5DB"; }}}
      onMouseLeave={(e) => { if (!disabled) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E5E7EB"; }}}
    >
      {children}
    </button>
  );

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 20px",
      borderTop: "1px solid #F3F4F6",
      background: "#fff",
      borderRadius: "0 0 16px 16px",
      flexWrap: "wrap",
      gap: 12,
    }}>

      {/* Page info */}
      <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>
        Page{" "}
        <span style={{ fontWeight: 600, color: "#111827" }}>{currentPage + 1}</span>
        {" "}of{" "}
        <span style={{ fontWeight: 600, color: "#111827" }}>{totalPages}</span>
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

        {/* First */}
        <NavBtn onClick={() => onPageChange(0)} disabled={isFirst} title="First page">
          <ChevronsLeft size={14} strokeWidth={2} />
        </NavBtn>

        {/* Prev */}
        <NavBtn onClick={() => onPageChange(currentPage - 1)} disabled={isFirst} title="Previous page">
          <ChevronLeft size={14} strokeWidth={2} />
        </NavBtn>

        {/* Ellipsis left */}
        {pages[0] > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              style={btnBase}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
            >
              1
            </button>
            {pages[0] > 1 && (
              <span style={{ fontSize: 12, color: "#9CA3AF", padding: "0 4px" }}>•••</span>
            )}
          </>
        )}

        {/* Page numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={page === currentPage ? btnActive : btnBase}
            onMouseEnter={(e) => { if (page !== currentPage) e.currentTarget.style.background = "#F3F4F6"; }}
            onMouseLeave={(e) => { if (page !== currentPage) e.currentTarget.style.background = "#fff"; }}
          >
            {page + 1}
          </button>
        ))}

        {/* Ellipsis right */}
        {pages[pages.length - 1] < totalPages - 1 && (
          <>
            {pages[pages.length - 1] < totalPages - 2 && (
              <span style={{ fontSize: 12, color: "#9CA3AF", padding: "0 4px" }}>•••</span>
            )}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              style={btnBase}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F3F4F6"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <NavBtn onClick={() => onPageChange(currentPage + 1)} disabled={isLast} title="Next page">
          <ChevronRight size={14} strokeWidth={2} />
        </NavBtn>

        {/* Last */}
        <NavBtn onClick={() => onPageChange(totalPages - 1)} disabled={isLast} title="Last page">
          <ChevronsRight size={14} strokeWidth={2} />
        </NavBtn>

      </div>
    </div>
  );
}

export default Pagination;