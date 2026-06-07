import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function OverviewGalleryStack({
  images,
  fullWidth = false,
  compact = false,
}: {
  images: string[];
  fullWidth?: boolean;
  compact?: boolean;
}) {
  if (images.length === 0) return null;

  if (compact) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28">
        <div className="flex flex-col gap-6 sm:gap-8">
          {images.map((src, i) => (
            <motion.div
              key={`${src.slice(0, 40)}-${i}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="w-full rounded-2xl border border-border bg-subtle/50 overflow-hidden shadow-card"
            >
              <div className="flex items-center justify-center py-10 sm:py-14 md:py-16 px-6 sm:px-10 md:px-14">
                <img
                  src={src}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  className="w-full max-w-4xl mx-auto h-auto max-h-[280px] sm:max-h-[380px] md:max-h-[480px] object-contain"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full flex flex-col",
        fullWidth ? "py-2 pb-8 sm:pb-12" : "py-2 pb-6 sm:pb-10 items-center",
      )}
    >
      {images.map((src, i) => (
        <motion.div
          key={`${src.slice(0, 40)}-${i}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.1 }}
          className={cn(
            "relative overflow-hidden bg-white shadow-elegant",
            fullWidth
              ? "w-full rounded-none border-y border-border"
              : "w-full max-w-xs sm:max-w-sm mx-auto rounded-2xl border border-border",
            i > 0 && (fullWidth ? "-mt-14 sm:-mt-20 md:-mt-28" : "-mt-14 sm:-mt-20 md:-mt-28"),
            !fullWidth && (i % 2 === 0 ? "sm:translate-x-3 md:translate-x-6" : "sm:-translate-x-3 md:-translate-x-6"),
          )}
          style={{ zIndex: i + 1 }}
        >
          <img
            src={src}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            className="w-full aspect-[3/4] object-cover object-center"
          />
        </motion.div>
      ))}
    </div>
  );
}
