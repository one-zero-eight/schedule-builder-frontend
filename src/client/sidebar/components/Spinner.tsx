import { clsx } from 'clsx';

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-label="Loading"
      role="status"
      className={clsx(
        'inline-block w-6 h-6 align-middle animate-spin',
        className
      )}
    >
      <circle
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
