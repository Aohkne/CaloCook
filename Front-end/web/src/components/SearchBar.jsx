import { Input } from "antd";

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
  width = 250,
}) {
  return (
    <Input.Search
      allowClear
      enterButton
      placeholder={placeholder}
      onSearch={(value) => onSearch({ search: value })}
      style={{ width }}
    />
  );
}
