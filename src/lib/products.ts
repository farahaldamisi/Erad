import laptop1 from "@/assets/p-laptop1.jpg";
import laptop2 from "@/assets/p-laptop2.jpg";
import printer1 from "@/assets/p-printer1.jpg";
import printer2 from "@/assets/p-printer2.jpg";
import desktop1 from "@/assets/p-desktop1.jpg";
import case1 from "@/assets/p-case1.jpg";
import acc1 from "@/assets/p-acc1.jpg";
import acc2 from "@/assets/p-cable1.jpg";
import { createSampleLaptopSpecs, mergeWithGamingDesktopTemplate, mergeWithLaptopTemplate } from "./spec-templates";

/** Section id — see `sections` catalog in admin. */
export type Category = string;

export function isLaptopLikeSection(sectionId: string): boolean {
  return sectionId === "laptops" || sectionId === "desktops";
}

export function isGamingDesktop(category: string, subcategory: string): boolean {
  return category === "desktops" && subcategory === "gaming";
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
  /** Highlight on home bar and in New Arrivals filter */
  isNewArrival?: boolean;
  /** When &gt; 0, product appears in Special Offers */
  discountPercent?: number;
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

function gamingPcSpecs(
  gpuManufacturer: string,
  gpuModel: string,
  gpuMemory: string,
  cooler: string,
): SpecGroup[] {
  return mergeWithGamingDesktopTemplate([
    {
      group: "Processor Specifications",
      items: [
        { label: "Processor Brand", value: "Intel" },
        { label: "Processor Type", value: "Intel Core i5" },
        { label: "Processor Generation", value: "14th Generation" },
        { label: "Processor Model", value: "i5-14600K" },
        { label: "Processor Speed", value: "3.5GHz up to 5.3GHz" },
        { label: "Number Of Cores", value: "14 Cores" },
        { label: "Processor Cache", value: "24M Cache" },
      ],
    },
    {
      group: "Memory",
      items: [
        { label: "Memory Size", value: "32 GB" },
        { label: "Memory Type", value: "DDR5" },
      ],
    },
    {
      group: "Graphic Card Specifications",
      items: [
        { label: "Graphic Manufacturer", value: gpuManufacturer },
        { label: "Graphic Memory Size", value: gpuMemory },
        { label: "Graphic Card Model", value: gpuModel },
        { label: "Graphic Type", value: "Dedicated" },
      ],
    },
    {
      group: "Storage",
      items: [
        { label: "Storage Technology", value: "NVMe SSD" },
        { label: "Storage Size", value: "1 TB" },
      ],
    },
    {
      group: "Features",
      items: [{ label: "Cooling", value: cooler }],
    },
    {
      group: "Operating System",
      items: [{ label: "Operating System", value: "Windows 11" }],
    },
  ]);
}

const rawProducts: Product[] = [
  { id: "lap-001", name: "ProBook Gaming X1", nameAr: "بروبوك جيمنغ X1", brand: "Lenovo", price: 1299, category: "laptops", subcategory: "gaming", subcategoryAr: "جيمنغ", image: laptop1, gallery: [laptop1, laptop2, laptop1], overviewGallery: [laptop1, laptop2], stock: 8, overview: "Powerful gaming laptop with RTX graphics and high refresh display for competitive play.", overviewAr: "لابتوب جيمنغ قوي مع كرت RTX وشاشة بتردد عالٍ لتجربة لعب احترافية.", specs: laptopSpecs },
  { id: "lap-002", name: "TouchSlim 14 OLED", nameAr: "تتش سليم 14 OLED", brand: "HP", price: 999, category: "laptops", subcategory: "touch", subcategoryAr: "تتش", image: laptop2, gallery: [laptop2, laptop1, laptop2], overviewGallery: [laptop2, laptop1], stock: 12, overview: "Ultra-thin touchscreen laptop with OLED display and all-day battery.", overviewAr: "لابتوب تتش نحيف جداً بشاشة OLED وبطارية تدوم طوال اليوم.", specs: laptopSpecs, isNewArrival: true },
  { id: "lap-003", name: "EliteBook 13", nameAr: "إيليت بوك 13", brand: "Dell", price: 799, category: "laptops", subcategory: "business", subcategoryAr: "لابتوب أعمال", image: laptop1, gallery: [laptop1, laptop2, laptop1], overviewGallery: [laptop1, laptop2], stock: 0, overview: "Reliable business laptop for work and study.", overviewAr: "لابتوب أعمال موثوق للعمل والدراسة.", specs: laptopSpecs },
  { id: "prn-001", name: "OfficeJet Pro M404", nameAr: "أوفيس جيت برو M404", brand: "HP", price: 249, category: "printers", subcategory: "general", subcategoryAr: "كل الطابعات", image: printer1, gallery: [printer1, printer2, printer1], overviewGallery: [printer1, printer2], stock: 15, overview: "Compact office printer with fast laser printing and Wi-Fi.", overviewAr: "طابعة مكتبية مدمجة بطباعة ليزر سريعة ودعم واي فاي.", specs: printerSpecs },
  { id: "prn-002", name: "Enterprise MFP 5800", nameAr: "إنتربرايز MFP 5800", brand: "Canon", price: 1899, category: "printers", subcategory: "general", subcategoryAr: "كل الطابعات", image: printer2, gallery: [printer2, printer1, printer2], overviewGallery: [printer2, printer1], stock: 4, overview: "Heavy-duty multifunction printer for high-volume offices.", overviewAr: "طابعة متعددة الوظائف لمكاتب الإنتاج العالي.", specs: printerSpecs },
  { id: "dsk-001", name: "All-in-One Studio 24", nameAr: "أول إن وان ستوديو 24", brand: "Apple", price: 1499, category: "desktops", subcategory: "standard", subcategoryAr: "عادي", image: desktop1, gallery: [desktop1, desktop1, desktop1], overviewGallery: [desktop1, desktop1], stock: 6, overview: "Sleek all-in-one desktop with 24\" display.", overviewAr: "جهاز حاسوب أنيق متكامل بشاشة 24 بوصة.", specs: laptopSpecs },
  {
    id: "gpc-001",
    name: "ERAD Power 9070XT-104 with AMD Radeon RX 9070 XT 16GB Graphic Card with Liquid Cooler",
    nameAr: "ERAD Power 9070XT-104 مع كرت AMD Radeon RX 9070 XT 16GB وتبريد سائل",
    brand: "ERAD Power",
    price: 1549,
    category: "desktops",
    subcategory: "gaming",
    subcategoryAr: "جيمنغ",
    image: case1,
    gallery: [case1, case1, case1],
    overviewGallery: [case1, case1],
    stock: 5,
    overview: "Intel 14Gen Core i5-14600K Processor at 3.5Ghz Up to 5.3Ghz, 24M Cache with Liquid Cooler",
    overviewAr: "معالج Intel 14Gen Core i5-14600K بسرعة 3.5Ghz حتى 5.3Ghz، 24M Cache مع تبريد سائل",
    specs: gamingPcSpecs("AMD Radeon", "RX 9070 XT", "16GB", "Liquid Cooler"),
  },
  {
    id: "gpc-002",
    name: "ERAD Power 9070-105 with AMD Radeon 9070 16GB Graphic Card with Advanced Air Cooler",
    nameAr: "ERAD Power 9070-105 مع كرت AMD Radeon 9070 16GB وتبريد هواء متقدم",
    brand: "ERAD Power",
    price: 1499,
    category: "desktops",
    subcategory: "gaming",
    subcategoryAr: "جيمنغ",
    image: case1,
    gallery: [case1, case1, case1],
    overviewGallery: [case1, case1],
    stock: 4,
    overview: "Intel 14Gen Core i5-14600K Processor at 3.5Ghz Up to 5.3Ghz, 24M Cache with Advanced Air Cooler",
    overviewAr: "معالج Intel 14Gen Core i5-14600K بسرعة 3.5Ghz حتى 5.3Ghz، 24M Cache مع تبريد هواء متقدم",
    specs: gamingPcSpecs("AMD Radeon", "9070", "16GB", "Advanced Air Cooler"),
  },
  {
    id: "gpc-003",
    name: "ERAD Power 5060TI-114 with Nvidia RTX 5060 Ti 16GB Graphic Card with Liquid Cooler",
    nameAr: "ERAD Power 5060TI-114 مع كرت Nvidia RTX 5060 Ti 16GB وتبريد سائل",
    brand: "ERAD Power",
    price: 1499,
    category: "desktops",
    subcategory: "gaming",
    subcategoryAr: "جيمنغ",
    image: case1,
    gallery: [case1, case1, case1],
    overviewGallery: [case1, case1],
    stock: 6,
    overview: "Intel 14Gen Core i5-14600K Processor at 3.5Ghz Up to 5.3Ghz, 24M Cache with Liquid Cooler",
    overviewAr: "معالج Intel 14Gen Core i5-14600K بسرعة 3.5Ghz حتى 5.3Ghz، 24M Cache مع تبريد سائل",
    specs: gamingPcSpecs("Nvidia GeForce", "RTX 5060 Ti", "16GB", "Liquid Cooler"),
  },
  { id: "cas-001", name: "Vortex RGB Tower", nameAr: "فورتكس RGB تاور", brand: "NZXT", price: 189, category: "components", subcategory: "case", subcategoryAr: "كيس", image: case1, gallery: [case1, case1, case1], overviewGallery: [case1, case1], stock: 20, overview: "Premium ATX tower with tempered glass and RGB fans.", overviewAr: "كيس ATX فاخر بزجاج مقوّى ومراوح RGB.", specs: [{ group: "Form", items: [{ label: "Type", value: "Mid-Tower ATX" }, { label: "Material", value: "Steel + Tempered Glass" }] }] },
  { id: "acc-001", name: "Phantom Wireless Mouse", nameAr: "ماوس فانتوم لاسلكي", brand: "Logitech", price: 79, category: "accessories", subcategory: "mouse", subcategoryAr: "ماوس", image: acc1, gallery: [acc1, acc1, acc1], overviewGallery: [acc1, acc1], stock: 50, overview: "Precision wireless mouse with RGB and 25K DPI sensor.", overviewAr: "ماوس لاسلكي دقيق مع RGB وحساس 25K DPI.", specs: [{ group: "Specs", items: [{ label: "DPI", value: "25,600" }, { label: "Battery", value: "70 hours" }] }] },
  { id: "acc-002", name: "Mech RGB Keyboard", nameAr: "كيبورد ميكانيكي RGB", brand: "Razer", price: 149, category: "accessories", subcategory: "keyboard", subcategoryAr: "كيبورد", image: acc2, gallery: [acc2, acc2, acc2], overviewGallery: [acc2, acc2], stock: 30, overview: "Mechanical gaming keyboard with per-key RGB.", overviewAr: "كيبورد ميكانيكي للجيمنغ بإضاءة RGB لكل زر.", specs: [{ group: "Specs", items: [{ label: "Switch", value: "Optical Linear" }, { label: "Layout", value: "TKL" }] }], discountPercent: 15 },
  { id: "gam-001", name: "Pro Racing Gaming Chair", nameAr: "كرسي جيمنغ Pro Racing", brand: "ERAD", price: 249, category: "gaming", subcategory: "chair", subcategoryAr: "كرسي جيمنغ", image: acc1, gallery: [acc1, acc1, acc1], overviewGallery: [acc1, acc1], stock: 10, overview: "Ergonomic gaming chair with lumbar support and adjustable armrests.", overviewAr: "كرسي جيمنغ مريح بدعم للظهر ومساند قابلة للتعديل.", specs: [{ group: "Specs", items: [{ label: "Material", value: "PU Leather" }, { label: "Max Load", value: "150 kg" }] }] },
  { id: "mon-001", name: "Dahua 27\" IPS Monitor", nameAr: "شاشة داهوا 27 بوصة IPS", brand: "Dahua", price: 189, category: "monitors", subcategory: "business", subcategoryAr: "شاشة أعمال", image: laptop2, gallery: [laptop2, laptop2, laptop2], overviewGallery: [laptop2, laptop2], stock: 14, overview: "27-inch Dahua IPS monitor with slim bezels and vivid color.", overviewAr: "شاشة داهوا IPS 27 بوصة بإطار رفيع وألوان زاهية.", specs: [{ group: "Display", items: [{ label: "Size", value: "27\"" }, { label: "Panel", value: "IPS" }, { label: "Resolution", value: "1920 x 1080" }] }], isNewArrival: true },
  { id: "cab-001", name: "USB-C to HDMI Adapter", nameAr: "محول USB-C إلى HDMI", brand: "UGREEN", price: 19, category: "network", subcategory: "adapters", subcategoryAr: "محولات", image: acc1, gallery: [acc1, acc1, acc1], overviewGallery: [acc1, acc1], stock: 45, overview: "Compact USB-C to HDMI adapter for laptops and tablets — 4K output.", overviewAr: "محول USB-C إلى HDMI مدمج للابتوبات والأجهزة اللوحية — دعم 4K.", specs: cableSpecs },
  { id: "cab-002", name: "Cat6 Ethernet Cable 5m", nameAr: "كابل شبكة Cat6 - 5 متر", brand: "D-Link", price: 12, category: "network", subcategory: "cables", subcategoryAr: "كابلات شبكة", image: acc2, gallery: [acc2, acc2, acc2], overviewGallery: [acc2, acc2], stock: 60, overview: "High-speed Cat6 patch cable for home and office networks.", overviewAr: "كابل Cat6 عالي السرعة للشبكات المنزلية والمكتبية.", specs: cableSpecs2 },
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
    specs = isGamingDesktop(p.category, p.subcategory)
      ? mergeWithGamingDesktopTemplate(specs)
      : mergeWithLaptopTemplate(specs);
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
    isNewArrival: Boolean(p.isNewArrival ?? seed?.isNewArrival),
    discountPercent: clampDiscount(p.discountPercent ?? seed?.discountPercent),
  };
}

function clampDiscount(value?: number): number {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export const products: Product[] = rawProducts.map(normalizeProduct);
