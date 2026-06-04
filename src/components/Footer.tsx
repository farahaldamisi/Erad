import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useProducts } from "@/lib/products-context";
import { getSectionLabel, sortSections } from "@/lib/sections";
import logo from "@/assets/logo.png";
import { ERAD_PHONE, ERAD_EMAIL } from "@/lib/contact";
import { CompanyMap } from "@/components/CompanyMap";

export function Footer() {
  const { t, lang } = useI18n();
  const { sections } = useProducts();

  return (
    <footer className="bg-subtle border-t border-border mt-24">
      <CompanyMap />

      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4 border-t border-border">
        <div>
          <img src={logo} alt="ERAD" className="h-20 sm:h-24 w-auto max-w-[220px] sm:max-w-[260px] object-contain" />
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">{t("nav_products")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {sortSections(sections).map(section => (
              <li key={section.id}>
                <Link to="/products" search={{ category: section.id }} className="hover:text-primary">
                  {getSectionLabel(section, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">{t("nav_services")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-primary">{t("cat_maintenance")}</Link></li>
            <li><Link to="/services" className="hover:text-primary">{t("cat_networking")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">{t("nav_contact")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{ERAD_PHONE}</li>
            <li>{ERAD_EMAIL}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ERAD. {t("footer_rights")}
      </div>
    </footer>
  );
}
