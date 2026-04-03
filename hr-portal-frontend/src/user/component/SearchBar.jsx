 import React, { memo } from "react";

const SearchBar = memo(({ searchTerm, setSearchTerm }) => {
  return (
    <div>
      <input
        type="text"
        className="border w-[240px] p-2 rounded w-1/3"
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by reason or type here...."
        value={searchTerm ?? ""}  // ✅ avoids null/undefined warnings
      />
    </div>
  );
});

export default SearchBar;
