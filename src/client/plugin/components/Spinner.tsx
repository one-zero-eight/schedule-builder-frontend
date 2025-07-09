interface SpinnerProps {
  color?: string;
}

export default function Spinner({ color = 'innohassle' }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-label="Loading"
      role="status"
      className="inline-block w-6 h-6 align-middle animate-spin"
    >
      <circle
        className={`text-${color}`}
        style={{
          fill: 'none',
          strokeWidth: 3,
          strokeLinecap: 'round',
          stroke: 'currentColor',
        }}
        cx="16"
        cy="16"
        r="12"
        strokeDasharray="60"
        strokeDashoffset="20"
      />
    </svg>
  );
}
