import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function InsightPanel({
  insights = [],
  title = "Key Insights",
}) {
  const visible = insights.slice(0, 6);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
          <Lightbulb className="h-4 w-4 text-amber-500" />
        </div>

        <h3 className="text-sm font-semibold text-title">
          {title}
        </h3>
      </div>

      {/* إذا لم توجد Insights */}
      {visible.length === 0 ? (
        <p className="text-sm text-slate-500">
          No insights available.
        </p>
      ) : (
        <>
          {/* Insights List */}
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {visible.map((insight, index) => (
              <motion.li
                key={index}
                variants={item}
                className="flex items-start gap-3 text-sm leading-relaxed text-body"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span>{insight}</span>
              </motion.li>
            ))}
          </motion.ul>

          {insights.length > 6 && (
            <p className="mt-3 text-xs text-slate-400">
              +{insights.length - 6} more insights
            </p>
          )}
        </>
      )}
    </div>
  );
}