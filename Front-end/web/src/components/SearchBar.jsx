import { Input, Select } from "antd";

export default function SearchBar({
  placeholder,
  searchText,
  setSearchText,
  classname,
}) {
  return (
    // Search bar with a search icon and a filter button
    <div className={`${classname}`}>
      <Input
        placeholder={placeholder}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}
