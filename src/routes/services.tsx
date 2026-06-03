import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Wrench, Network, Cpu, Cable, Wifi, ShieldCheck } from "lucide-react";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Services — ERAD" }] }),
  component: Services,
});

function Services() {
  const { t } = useI18n();
  const blocks = [
    { icon: Wrench, title: t("cat_maintenance"), desc: t("maintenance_desc"), items: ["Hardware diagnostics", "Screen & keyboard replacement", "Data recovery", "OS reinstall & optimization"] },
    { icon: Network, title: t("cat_networking"), desc: t("networking_desc"), items: ["Switch & router setup", "Structured cabling", "Wi-Fi access points", "Firewall configuration"] },
  ];
  const small = [
    { icon: Cpu, title: "Upgrades", desc: "RAM, SSD and GPU upgrades" },
    { icon: Cable, title: "Cabling", desc: "Clean structured cabling" },
    { icon: Wifi, title: "Wi-Fi", desc: "Mesh & enterprise APs" },
    { icon: ShieldCheck, title: "Support", desc: "On-site and remote" },
  ];
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mb-12">
        <h1 className="text-5xl font-bold mb-3">{t("services_title")}</h1>
        <p className="text-muted-foreground text-lg">{t("services_sub")}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {blocks.map((b, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-hero text-white rounded-3xl p-8 shadow-elegant">
            <b.icon className="size-12 mb-4" />
            <h2 className="text-3xl font-bold mb-2">{b.title}</h2>
            <p className="text-white/80 mb-5">{b.desc}</p>
            <ul className="space-y-1.5 text-sm">
              {b.items.map(i => <li key={i} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-white/80" /> {i}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {small.map((s, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-glow hover:-translate-y-1 transition">
            <s.icon className="size-8 text-primary mb-3" />
            <h3 className="font-bold mb-1">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
        <ServiceRequestForm />
      </motion.div>
    </div>
  );
}
