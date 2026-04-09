export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 w-full mb-3"
    />
  );
}