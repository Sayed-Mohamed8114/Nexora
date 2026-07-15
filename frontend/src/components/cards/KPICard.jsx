import { motion } from "framer-motion";

export default function KPICard({
  icon: Icon,
  value,
  label,
  title,
  iconBg = "#009EF7",
  highlight = false,
}) {
  const displayLabel = label || title || "";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative flex items-center gap-4 bg-sky-50 overflow-hidden rounded-xl border border-border bg-card px-5 py-4 shadow-sm ${
        highlight ? "ring-2 ring-amber-400/40" : ""
      }`}
    >
      {/* Highlight glow */}
      {highlight && (
        <div className="absolute -right-4 -top-4 select-none text-5xl opacity-10">
          ★
        </div>
      )}

      {/* Icon */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${iconBg}18` }}
      >
        <Icon size={20} className="shrink-0" style={{ color: iconBg }} />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-2xl font-extrabold leading-tight text-title">
          {value}
        </p>

        <p className="mt-0.5 truncate text-xs font-medium text-body">
          {displayLabel}
        </p>
      </div>
    </motion.div>
  );
}