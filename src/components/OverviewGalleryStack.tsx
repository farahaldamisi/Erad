import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function OverviewGalleryStack({
  images,
  fullWidth = false,
}: {
  images: string[];
  fullWidth?: boolean;
}) {
  if (images.length === 0) return null;

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
