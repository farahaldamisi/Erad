export const ERAD_PHONES = ["0793315007", "079171596", "0791900787"] as const;
export const ERAD_PHONE = ERAD_PHONES[0];
export const ERAD_PHONE_WHATSAPP = "962793315007";
export const ERAD_EMAIL = "info@erad.com";
export const ERAD_FACEBOOK_URL = "https://www.facebook.com/EradMall.jo";

export const ERAD_ADDRESS = "Amman, Jordan";
export const ERAD_ADDRESS_AR = "عمان، الأردن";

/** Map pin — update lat/lng when you have the exact shop location */
export const ERAD_MAP = {
  lat: 31.9539,
  lng: 35.9106,
  zoom: 14,
};

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${ERAD_PHONE_WHATSAPP}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function googleMapsDirectionsUrl() {
  return `https://www.google.com/maps/dir/?api=1&destination=${ERAD_MAP.lat},${ERAD_MAP.lng}`;
}

export function googleMapsEmbedUrl(lang: "ar" | "en" = "en") {
  const { lat, lng, zoom } = ERAD_MAP;
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=${lang}&z=${zoom}&output=embed`;
}
