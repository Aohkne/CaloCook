import { Input, Select } from "antd";

export default function SearchBar({
  searchText,
  setSearchText,
  setRoleFilter,
}) {
  return (
    // Search bar with a search icon and a filter button
    <div className="flex mt-5 gap-2 mb-3">
      <Input
        placeholder="Search user..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Select
        defaultValue={"All"}
        style={{ width: 120 }}
        options={[
          { value: "all", label: "All" },
          { value: "admin", label: "Admin" },
          { value: "user", label: "User" },
        ]}
        onChange={(value) => setRoleFilter(value)}
      />
    </div>
  );
}
