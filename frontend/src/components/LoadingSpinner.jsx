export default function LoadingSpinner({ size = "md", label = "Loading..." }) {
  const dim = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-12 h-12" : "w-8 h-8";
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status">
      <div
        className={`${dim} rounded-full border-2 animate-spin`}
        style={{ borderColor: "var(--color-navy-600)", borderTopColor: "var(--color-sky-500)" }}
        aria-hidden="true"
      />
      {label && <p className="text-sm" style={{ color: "#94a3b8" }}>{label}</p>}
      <span className="sr-only">{label}</span>
    </div>
  );
}