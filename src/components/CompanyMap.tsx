import { MapPin, Navigation } from "lucide-react";
import {
  ERAD_ADDRESS,
  ERAD_ADDRESS_AR,
  ERAD_EMAIL,
  ERAD_PHONES,
  googleMapsDirectionsUrl,
  googleMapsEmbedUrl,
} from "@/lib/contact";
import { useI18n } from "@/lib/i18n";

export function CompanyMap() {
  const { t, lang } = useI18n();
  const address = lang === "ar" ? ERAD_ADDRESS_AR : ERAD_ADDRESS;

  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <MapPin className="size-6 text-primary" />
              {t("our_location")}
            </h3>
            <p className="text-muted-foreground text-sm">{address}</p>
            <ul className="mt-2 text-sm text-muted-foreground space-y-1">
              {ERAD_PHONES.map(phone => (
                <li key={phone}>
                  <a href={`tel:${phone}`} className="hover:text-primary transition">
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${ERAD_EMAIL}`} className="hover:text-primary transition">
                  {ERAD_EMAIL}
                </a>
              </li>
            </ul>
          </div>
          <a
            href={googleMapsDirectionsUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-glow hover:opacity-90 transition"
          >
            <Navigation className="size-4" />
            {t("open_in_maps")}
          </a>
        </div>

        <div className="relative w-full h-[min(420px,55vh)] rounded-2xl overflow-hidden border border-border shadow-card">
          <iframe
            title={t("our_location")}
            src={googleMapsEmbedUrl(lang === "ar" ? "ar" : "en")}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
