"use client";

export type ViewMode = "chart" | "table";

type Props = {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
};

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-stretch k-border-l">
      <button
        type="button"
        onClick={() => onChange("chart")}
        className={`px-3 k-hover ${value === "chart" ? "k-active" : ""}`}
      >
        chart
      </button>
      <button
        type="button"
        onClick={() => onChange("table")}
        className={`px-3 k-border-l k-hover ${value === "table" ? "k-active" : ""}`}
      >
        table
      </button>
    </div>
  );
}
