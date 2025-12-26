"use client";

type FilterChipProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

export default function FilterChip({
  label,
  isActive,
  onClick,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 mb-1 rounded-full text-sm font-medium transition-all duration-200 
  ${
    isActive
      ? "bg-gray-600 text-white"
      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
  }`}
    >
      {label}
    </button>
  );
}
