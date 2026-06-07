import {
  Computer,
  Cpu,
  Gamepad2,
  HardDrive,
  Headphones,
  Laptop,
  Monitor,
  Network,
  Printer,
  type LucideIcon,
} from "lucide-react";
import type { DictKey } from "./i18n";

export interface HomeQuickCategory {
  labelKey: DictKey;
  icon: LucideIcon;
  search: { category?: string; sub?: string; q?: string; sort?: "newest" };
}

export const homeQuickCategories: HomeQuickCategory[] = [
  { labelKey: "home_cat_laptop", icon: Laptop, search: { category: "laptops", sort: "newest" } },
  { labelKey: "home_cat_monitor", icon: Monitor, search: { category: "monitors", sort: "newest" } },
  { labelKey: "home_cat_component", icon: Cpu, search: { category: "components", sort: "newest" } },
  { labelKey: "home_cat_storage", icon: HardDrive, search: { category: "components", sub: "ram", sort: "newest" } },
  { labelKey: "home_cat_gaming", icon: Gamepad2, search: { category: "gaming", sort: "newest" } },
  { labelKey: "home_cat_accessories", icon: Headphones, search: { category: "accessories", sort: "newest" } },
  { labelKey: "home_cat_printer", icon: Printer, search: { category: "printers", sort: "newest" } },
  { labelKey: "home_cat_desktop", icon: Computer, search: { category: "desktops", sort: "newest" } },
  { labelKey: "home_cat_network", icon: Network, search: { category: "network", sort: "newest" } },
];

export function homeQuickCategorySearch(item: HomeQuickCategory) {
  const { category = "all", sub, q, sort = "newest" } = item.search;
  return {
    category,
    sort,
    ...(sub ? { sub } : {}),
    ...(q ? { q } : {}),
  };
}
