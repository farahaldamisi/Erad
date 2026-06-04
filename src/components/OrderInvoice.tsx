import logo from "@/assets/logo.png";
import { ERAD_ADDRESS, ERAD_ADDRESS_AR, ERAD_PHONE } from "@/lib/contact";
import { formatPrice } from "@/lib/currency";
import { formatDateOnly, formatDayName, formatNumber } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { formatOrderNumber, getOrderTotals, type Order } from "@/lib/orders";
import { useProducts } from "@/lib/products-context";

export function OrderInvoice({ order }: { order: Order }) {
  const { t, lang } = useI18n();
  const { products } = useProducts();
  const { subtotal, discount, tax, total } = getOrderTotals(order);
  const companyAddress = lang === "ar" ? ERAD_ADDRESS_AR : ERAD_ADDRESS;

  const resolveBrand = (productId: string, stored?: string) =>
    stored ?? products.find(p => p.id === productId)?.brand;

  return (
    <article className="rounded-3xl border border-border bg-card shadow-card overflow-hidden print:shadow-none print:border-black/20">
      {/* Logo — top start corner, follows language direction */}
      <div className="relative px-4 sm:px-6 pt-4 pb-2 min-h-[4rem] sm:min-h-[5rem] bg-subtle/20">
        <img
          src={logo}
          alt="ERAD"
          className="absolute top-3 sm:top-4 start-3 sm:start-4 h-12 sm:h-16 md:h-[4.5rem] w-auto object-contain print:top-4 print:start-4"
        />
      </div>

      {/* Primary info */}
      <section className="px-6 pt-2 pb-5 border-b border-border">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide text-start mb-4">{t("invoice_title")}</h2>
        <div className="rounded-2xl border border-border bg-subtle/30 px-4 py-4 sm:px-5 sm:py-5 space-y-3">
          <PrimaryRow label={t("admin_order_id")} value={formatOrderNumber(order.id)} />
          <PrimaryRow label={t("full_name")} value={order.customerName} />
          <PrimaryRow label={t("phone")} value={order.phone} />
          <PrimaryRow label={t("payment")} value={t(order.paymentMethod as "cash" | "visa")} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {t("delivery_address")}
            </p>
            <p className="text-sm sm:text-base font-semibold whitespace-pre-line leading-relaxed">
              {order.address}
            </p>
          </div>
        </div>
      </section>

      {/* Line items */}
      <div className="px-4 sm:px-6 py-5 overflow-x-auto border-b border-border">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b-2 border-border text-xs uppercase tracking-wider text-muted-foreground">
              <th className="text-start py-2.5 pe-3 font-semibold">{t("brand_label")}</th>
              <th className="text-start py-2.5 pe-3 font-semibold">{t("invoice_description")}</th>
              <th className="text-center py-2.5 px-2 font-semibold">{t("invoice_qty")}</th>
              <th className="text-end py-2.5 px-2 font-semibold">{t("price")}</th>
              <th className="text-end py-2.5 ps-2 font-semibold">{t("invoice_line_total")}</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => {
              const brand = resolveBrand(item.productId, item.brand);
              return (
                <tr key={`${order.id}-${item.productId}`} className="border-b border-border/60">
                  <td className="py-3 pe-3 align-top font-semibold text-muted-foreground">{brand ?? "—"}</td>
                  <td className="py-3 pe-3 align-top font-medium">{item.name}</td>
                  <td className="py-3 px-2 align-top text-center">{formatNumber(item.quantity)}</td>
                  <td className="py-3 px-2 align-top text-end whitespace-nowrap">
                    {formatPrice(item.unitPrice, lang)}
                  </td>
                  <td className="py-3 ps-2 align-top text-end font-semibold whitespace-nowrap">
                    {formatPrice(item.lineTotal, lang)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-6 py-5 border-b border-border flex justify-end">
        <dl className="w-full max-w-xs space-y-2 text-sm">
          <TotalRow label={t("invoice_subtotal")} value={formatPrice(subtotal, lang)} />
          <TotalRow
            label={t("invoice_discount")}
            value={discount > 0 ? `−${formatPrice(discount, lang)}` : formatPrice(0, lang)}
            muted={discount <= 0}
          />
          <TotalRow label={t("invoice_tax")} value={formatPrice(tax, lang)} muted={tax <= 0} />
          <div className="flex items-center justify-between pt-2 mt-2 border-t-2 border-border font-bold text-base">
            <dt>{t("cart_total")}</dt>
            <dd className="text-primary">{formatPrice(total, lang)}</dd>
          </div>
        </dl>
      </div>

      {/* Secondary info */}
      <section className="px-6 py-5 bg-subtle/25 space-y-3 text-sm border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          {t("invoice_secondary_info")}
        </p>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
          <SecondaryRow label={t("invoice_date")} value={formatDateOnly(order.createdAt, lang)} />
          <SecondaryRow label={t("invoice_day")} value={formatDayName(order.createdAt, lang)} />
          {order.customerEmail && (
            <SecondaryRow label={t("email")} value={order.customerEmail} className="sm:col-span-2" />
          )}
          <SecondaryRow label={t("invoice_delivery_location")} value={companyAddress} className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
              {t("invoice_notes")}
            </p>
            <p className="text-muted-foreground">{order.notes?.trim() || t("invoice_no_notes")}</p>
          </div>
        </div>
      </section>

      <footer className="px-6 py-4 bg-primary/5 text-center text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {t("invoice_footer_note").replace("{phone}", ERAD_PHONE)}
      </footer>
    </article>
  );
}

function PrimaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
        {label}:
      </span>
      <span className="text-sm sm:text-base font-semibold">{value}</span>
    </div>
  );
}

function SecondaryRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
      <p className="font-medium text-foreground/80">{value}</p>
    </div>
  );
}

function TotalRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${muted ? "text-muted-foreground" : ""}`}>
      <dt>{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
