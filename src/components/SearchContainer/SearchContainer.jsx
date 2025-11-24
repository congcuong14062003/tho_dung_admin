import { useState, useEffect } from "react";

export default function SearchContainer({
  onChange,
  placeholder = "Tìm kiếm...",
  defaultValue = "",
  debounce = 300,
}) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(value);
    }, debounce);

    return () => clearTimeout(timer);
  }, [value, debounce, onChange]);

  return (
    <div className="w-[500px]">
      <div
        className="
          flex items-center gap-2
          bg-white border border-gray-300
          px-3 py-2 rounded-xl
          focus-within:border-blue-500 
          focus-within:ring-2 focus-within:ring-blue-200
          transition-all
        "
      >
        <i className="mdi mdi-magnify text-gray-500 text-xl"></i>

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="
            flex-1 bg-transparent outline-none
            placeholder:text-gray-400
            text-gray-800
          "
        />
      </div>
    </div>
  );
}
