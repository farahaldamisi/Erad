import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { useI18n } from "@/lib/i18n";
import { createServiceRequest, SERVICE_TYPES, type ServiceType } from "@/lib/services";
import { useServiceRequestsCtx } from "@/lib/service-requests-context";

export function ServiceRequestForm() {
  const { t } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const { setRequests } = useServiceRequestsCtx();
  const [serviceType, setServiceType] = useState<ServiceType>("maintenance");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone);
    setEmail(user.email);
    if (user.addresses.length > 0) {
      setAddress(user.addresses[0].address);
    }
  }, [user]);

  const inputClass =
    "w-full h-11 rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const request = createServiceRequest({
      serviceType,
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      description: description.trim(),
      userId: user?.id,
    });
    setRequests(prev => [request, ...prev]);
    logActivity({
      type: "service_request",
      userId: user?.id,
      userName: name.trim(),
      userEmail: email.trim() || user?.email,
      label: t(`service_${serviceType}` as never),
      meta: { serviceType, phone: phone.trim() },
    });
    setSubmitted(true);
    setDescription("");
  };

  if (submitted) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 shadow-card text-center">
        <CheckCircle2 className="size-14 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("service_request_success")}</h2>
        <p className="text-muted-foreground mb-6">{t("service_request_success_sub")}</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="h-11 px-6 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition"
        >
          {t("service_request_another")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-card">
      <h2 className="text-2xl font-bold mb-1">{t("request_service")}</h2>
      <p className="text-muted-foreground mb-6">{t("request_service_sub")}</p>

      {!isAuthenticated && (
        <p className="text-xs text-muted-foreground bg-subtle rounded-lg px-3 py-2 mb-4">
          {t("login_to_order_hint")}{" "}
          <Link to="/login" search={{ redirect: "/services" }} className="text-primary font-semibold hover:underline">
            {t("login")}
          </Link>
        </p>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
            {t("service_type")}
          </label>
          <select
            required
            value={serviceType}
            onChange={e => setServiceType(e.target.value as ServiceType)}
            className={inputClass}
          >
            {SERVICE_TYPES.map(type => (
              <option key={type} value={type}>
                {t(`service_${type}` as never)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              {t("full_name")}
            </label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              readOnly={isAuthenticated}
              className={`${inputClass} ${isAuthenticated ? "bg-subtle cursor-default" : ""}`}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              {t("phone")}
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              readOnly={isAuthenticated}
              className={`${inputClass} ${isAuthenticated ? "bg-subtle cursor-default" : ""}`}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
            {t("email")} ({t("optional")})
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            readOnly={isAuthenticated}
            className={`${inputClass} ${isAuthenticated ? "bg-subtle cursor-default" : ""}`}
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
            {t("address")} ({t("optional")})
          </label>
          <input value={address} onChange={e => setAddress(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
            {t("service_description")}
          </label>
          <textarea
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t("service_description_placeholder")}
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition"
        >
          {t("submit_service_request")}
        </button>
      </form>
    </div>
  );
}
