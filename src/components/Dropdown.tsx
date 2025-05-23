import { ChangeEvent } from "react";

interface DropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}

export default function Dropdown({
  label,
  value,
  onChange,
  options,
  className = "",
}: DropdownProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}