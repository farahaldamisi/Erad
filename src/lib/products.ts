import laptop1 from "@/assets/p-laptop1.jpg";
import laptop2 from "@/assets/p-laptop2.jpg";
import printer1 from "@/assets/p-printer1.jpg";
import printer2 from "@/assets/p-printer2.jpg";
import desktop1 from "@/assets/p-desktop1.jpg";
import case1 from "@/assets/p-case1.jpg";
import acc1 from "@/assets/p-acc1.jpg";
import acc2 from "@/assets/p-cable1.jpg";
import { createSampleLaptopSpecs, mergeWithLaptopTemplate } from "./spec-templates";

/** Section id — see `sections` catalog in admin. */
export type Category = string;

export function isLaptopLikeSection(sectionId: string): boolean {
  return sectionId === "laptops" || sectionId === "desktops";
}

export interface SpecGroup { group: string; items: { label: string; value: string }[]; }

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  brand: string;
  price: number;
  category: Category;
  subcategory: string;
  subcategoryAr: string;
  image: string;
  gallery: string[];
  overviewGallery: string[];
  stock: number;
  overview: string;
  overviewAr: string;
  specs: SpecGroup[];
}

/** Storefront always shows the English product name, even in Arabic UI. */
export function getProductName(product: Pick<Product, "name">): string {
  return product.name;
}

const laptopSpecs: SpecGroup[] = createSampleLaptopSpecs();

const printerSpecs: SpecGroup[] = [
  { group: "Print", items: [
    { label: "Technology", value: "Laser" },
    { label: "Speed", value: "33 ppm" },
    { label: "Resolution", value: "1200 x 1200 dpi" },
    { label: "Duplex", value: "Automatic" },
  ]},
  { group: "Connectivity", items: [
    { label: "USB", value: "USB 2.0" },
    { label: "Network", value: "Ethernet, Wi-Fi" },
    { label: "Mobile", value: "AirPrint, Mopria" },
  ]},
  { group: "Paper", items: [
    { label: "Input", value: "250 sheets" },
    { label: "Sizes", value: "A4, A5, Letter" },
  ]},
  { group: "Warranty", items: [{ label: "Warranty", value: "2 Years" }] },
];

const cableSpecs: SpecGroup[] = [
  { group: "Specs", items: [
    { label: "Type", value: "USB-C to HDMI" },
    { label: "Length", value: "15 cm" },
    { label: "Resolution", value: "4K @ 60Hz" },
    { label: "Material", value: "Aluminum shell" },
  ]},
  { group: "Compatibility", items: [
    { label: "Input", value: "USB-C (DP Alt Mode)" },
    { label: "Output", value: "HDMI 2.0" },
  ]},
  { group: "Warranty", items: [{ label: "Warranty", value: "1 Year" }] },
];

const cableSpecs2: SpecGroup[] = [
  { group: "Specs", items: [
    { label: "Category", value: "Cat6 Ethernet" },
    { label: "Length", value: "5 m" },
    { label: "Speed", value: "1 Gbps" },
    { label: "Connectors", value: "RJ45 shielded" },
  ]},
  { group: "Features", items: [
    { label: "Jacket", value: "PVC" },
    { label: "Color", value: "Blue" },
  ]},
  { group: "Warranty", items: [{ label: "Warranty", value: "2 Years" }] },
];

const rawProducts: Product[] = [
  { id: "lap-001", name: "ProBook Gaming X1", nameAr: "بروبوك جيمنغ X1", brand: "Lenovo", price: 1299, category: "laptops", subcategory: "gaming", subcategoryAr: "جيمنغ", image: laptop1, gallery: [laptop1, laptop2, laptop1], overviewGallery: [laptop1, laptop2], stock: 8, overview: "Powerful gaming laptop with RTX graphics and high refresh display for competitive play.", overviewAr: "لابتوب جيمنغ قوي مع كرت RTX وشاشة بتردد عالٍ لتجربة لعب احترافية.", specs: laptopSpecs },
  { id: "lap-002", name: "TouchSlim 14 OLED", nameAr: "تتش سليم 14 OLED", brand: "HP", price: 999, category: "laptops", subcategory: "touch", subcategoryAr: "تتش", image: laptop2, gallery: [laptop2, laptop1, laptop2], overviewGallery: [laptop2, laptop1], stock: 12, overview: "Ultra-thin touchscreen laptop with OLED display and all-day battery.", overviewAr: "لابتوب تتش نحيف جداً بشاشة OLED وبطارية تدوم طوال اليوم.", specs: laptopSpecs },
  { id: "lap-003", name: "EliteBook 13", nameAr: "إيليت بوك 13", brand: "Dell", price: 799, category: "laptops", subcategory: "standard", subcategoryAr: "عادي", image: laptop1, gallery: [laptop1, laptop2, laptop1], overviewGallery: [laptop1, laptop2], stock: 0, overview: "Reliable everyday laptop for work and study.", overviewAr: "لابتوب موثوق للاستخدام اليومي للعمل والدراسة.", specs: laptopSpecs },
  { id: "prn-001", name: "OfficeJet Pro M404", nameAr: "أوفيس جيت برو M404", brand: "HP", price: 249, category: "printers", subcategory: "office", subcategoryAr: "مكتبية", image: printer1, gallery: [printer1, printer2, printer1], overviewGallery: [printer1, printer2], stock: 15, overview: "Compact office printer with fast laser printing and Wi-Fi.", overviewAr: "طابعة مكتبية مدمجة بطباعة ليزر سريعة ودعم واي فاي.", specs: printerSpecs },
  { id: "prn-002", name: "Enterprise MFP 5800", nameAr: "إنتربرايز MFP 5800", brand: "Canon", price: 1899, category: "printers", subcategory: "enterprise", subcategoryAr: "للشركات", image: printer2, gallery: [printer2, printer1, printer2], overviewGallery: [printer2, printer1], stock: 4, overview: "Heavy-duty multifunction printer for high-volume offices.", overviewAr: "طابعة متعددة الوظائف لمكاتب الإنتاج العالي.", specs: printerSpecs },
  { id: "dsk-001", name: "All-in-One Studio 24", nameAr: "أول إن وان ستوديو 24", brand: "Apple", price: 1499, category: "desktops", subcategory: "standard", subcategoryAr: "عادي", image: desktop1, gallery: [desktop1, desktop1, desktop1], overviewGallery: [desktop1, desktop1], stock: 6, overview: "Sleek all-in-one desktop with 24\" display.", overviewAr: "جهاز حاسوب أنيق متكامل بشاشة 24 بوصة.", specs: laptopSpecs },
  { id: "cas-001", name: "Vortex RGB Tower", nameAr: "فورتكس RGB تاور", brand: "NZXT", price: 189, category: "cases", subcategory: "gaming", subcategoryAr: "جيمنغ", image: case1, gallery: [case1, case1, case1], overviewGallery: [case1, case1], stock: 20, overview: "Premium ATX tower with tempered glass and RGB fans.", overviewAr: "كيس ATX فاخر بزجاج مقوّى ومراوح RGB.", specs: [{ group: "Form", items: [{ label: "Type", value: "Mid-Tower ATX" }, { label: "Material", value: "Steel + Tempered Glass" }] }] },
  { id: "acc-001", name: "Phantom Wireless Mouse", nameAr: "ماوس فانتوم لاسلكي", brand: "Logitech", price: 79, category: "accessories", subcategory: "standard", subcategoryAr: "عادي", image: acc1, gallery: [acc1, acc1, acc1], overviewGallery: [acc1, acc1], stock: 50, overview: "Precision wireless mouse with RGB and 25K DPI sensor.", overviewAr: "ماوس لاسلكي دقيق مع RGB وحساس 25K DPI.", specs: [{ group: "Specs", items: [{ label: "DPI", value: "25,600" }, { label: "Battery", value: "70 hours" }] }] },
  { id: "acc-002", name: "Mech RGB Keyboard", nameAr: "كيبورد ميكانيكي RGB", brand: "Razer", price: 149, category: "accessories", subcategory: "gaming", subcategoryAr: "جيمنغ", image: acc2, gallery: [acc2, acc2, acc2], overviewGallery: [acc2, acc2], stock: 30, overview: "Mechanical gaming keyboard with per-key RGB.", overviewAr: "كيبورد ميكانيكي للجيمنغ بإضاءة RGB لكل زر.", specs: [{ group: "Specs", items: [{ label: "Switch", value: "Optical Linear" }, { label: "Layout", value: "TKL" }] }] },
  { id: "cab-001", name: "USB-C to HDMI Adapter", nameAr: "محول USB-C إلى HDMI", brand: "UGREEN", price: 19, category: "cables-adapters", subcategory: "adapters", subcategoryAr: "محولات", image: acc1, gallery: [acc1, acc1, acc1], overviewGallery: [acc1, acc1], stock: 45, overview: "Compact USB-C to HDMI adapter for laptops and tablets — 4K output.", overviewAr: "محول USB-C إلى HDMI مدمج للابتوبات والأجهزة اللوحية — دعم 4K.", specs: cableSpecs },
  { id: "cab-002", name: "Cat6 Ethernet Cable 5m", nameAr: "كابل شبكة Cat6 - 5 متر", brand: "D-Link", price: 12, category: "cables-adapters", subcategory: "cables", subcategoryAr: "كابلات", image: acc2, gallery: [acc2, acc2, acc2], overviewGallery: [acc2, acc2], stock: 60, overview: "High-speed Cat6 patch cable for home and office networks.", overviewAr: "كابل Cat6 عالي السرعة للشبكات المنزلية والمكتبية.", specs: cableSpecs2 },
];

const seedById = new Map(rawProducts.map(p => [p.id, p]));

export function normalizeProduct(p: Product): Product {
  const gallery = p.gallery?.length ? p.gallery : p.image ? [p.image] : [];
  const seed = seedById.get(p.id);
  let specs = p.specs ?? [];
  const isLaptopLike = isLaptopLikeSection(p.category);
  const hasAnySpec = specs.some(g => g.items.some(it => it.value.trim()));

  if (isLaptopLike) {
    if (!hasAnySpec && seed?.specs?.length) specs = seed.specs;
    specs = mergeWithLaptopTemplate(specs);
  }

  const overviewGallery = Array.isArray(p.overviewGallery)
    ? p.overviewGallery
    : (seed?.overviewGallery ?? []);

  return {
    ...p,
    gallery,
    overview: p.overview?.trim() ? p.overview : seed?.overview ?? p.overview,
    overviewAr: p.overviewAr?.trim() ? p.overviewAr : seed?.overviewAr ?? p.overviewAr,
    overviewGallery,
    specs,
  };
}

export const products: Product[] = rawProducts.map(normalizeProduct);
