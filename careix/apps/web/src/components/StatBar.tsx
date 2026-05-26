interface StatBarProps {
  label: string;
  value: number;
}

export function StatBar({ label, value }: StatBarProps) {
  return (
    <div className="careix-stat" data-testid={`careix-stat-${label}`}>
      <div className="careix-stat__header">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <progress
        className="careix-stat__bar"
        max={100}
        value={value}
        aria-label={label}
      />
    </div>
  );
}
