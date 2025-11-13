interface LoadingSpinnerProps {
  size?: number;
}

export default function LoadingSpinner({ size = 24 }: LoadingSpinnerProps) {
  const borderSize = Math.max(2, Math.floor(size / 8));
  return (
    <div
      className="inline-block animate-spin rounded-full border border-gray-300 border-t-transparent"
      style={{ width: size, height: size, borderTopColor: 'transparent', borderWidth: borderSize }}
      aria-label="Loading"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
