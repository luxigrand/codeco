interface StatBarProps {
  label: string;
  value: number;
  color?: string;
}

export function StatBar({ label, value, color = "#7c5cff" }: StatBarProps) {
  return (
    <div className="careix-stat" data-testid={`careix-stat-${label}`}>
      <div className="careix-stat__header">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="careix-stat__track">
        <div
          className="careix-stat__fill"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
        />
      </div>
    </div>
  );
}
