export const ERAD_PHONES = ["0793315007", "079171596", "0791900787"] as const;
export const ERAD_PHONE = ERAD_PHONES[0];
export const ERAD_PHONE_WHATSAPP = "962793315007";
export const ERAD_EMAIL = "info@erad.com";
export const ERAD_FACEBOOK_URL = "https://www.facebook.com/EradMall.jo";

export const ERAD_ADDRESS = "Al Gardens - Wasfi Al-Tal St - Al Baraka Complex 93, Amman, Jordan";
export const ERAD_ADDRESS_AR = "الجاردنز - شارع وصفي التل - مجمع البركة 93";

/** Map pin — update lat/lng if you prefer fixed coordinates over address search */
export const ERAD_MAP = {
  lat: 31.9834,
  lng: 35.8878,
  zoom: 17,
};

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${ERAD_PHONE_WHATSAPP}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function googleMapsDirectionsUrl() {
  const destination = encodeURIComponent(ERAD_ADDRESS);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

export function googleMapsEmbedUrl(lang: "ar" | "en" = "en") {
  const query = encodeURIComponent(lang === "ar" ? ERAD_ADDRESS_AR : ERAD_ADDRESS);
  const { zoom } = ERAD_MAP;
  return `https://maps.google.com/maps?q=${query}&hl=${lang}&z=${zoom}&output=embed`;
}
