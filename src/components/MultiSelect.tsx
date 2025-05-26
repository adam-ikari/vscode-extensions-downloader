import { ChangeEvent } from "react";

interface MultiSelectProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}

export default function MultiSelect({
  label,
  values,
  onChange,
  options,
  className = "",
}: MultiSelectProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      onChange([...values, value]);
    } else {
      onChange(values.filter((v) => v !== value));
    }
  };

  return (
    <div className={className}>
      <label className="gap-4 block text-sm font-medium mb-1">{label}</label>
      <div className="flex flex-wrap space-x-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={option.value}
              checked={values.includes(option.value)}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}