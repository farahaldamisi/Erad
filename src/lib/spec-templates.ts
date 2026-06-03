import type { SpecGroup } from "./products";

/** Empty laptop spec fields — admin fills values in the product form. */
export function createLaptopSpecTemplate(): SpecGroup[] {
  const field = (label: string) => ({ label, value: "" });

  return [
    {
      group: "Processor Specifications",
      items: [
        field("Processor Brand"),
        field("Processor Type"),
        field("Processor Generation"),
        field("Processor Model"),
        field("Processor Speed"),
        field("Number Of Cores"),
        field("Processor Cache"),
      ],
    },
    {
      group: "Memory",
      items: [field("Memory Size"), field("Memory Type")],
    },
    {
      group: "Graphic Card Specifications",
      items: [
        field("Graphic Manufacturer"),
        field("Graphic Memory Size"),
        field("Graphic Card Model"),
        field("Graphic Type"),
      ],
    },
    {
      group: "Display",
      items: [
        field("Display Size"),
        field("Display Technology"),
        field("Display Type"),
        field("Resolution"),
      ],
    },
    {
      group: "Storage",
      items: [field("Storage Technology"), field("Storage Size")],
    },
    {
      group: "Inputs & Outputs",
      items: [
        field("Optical Drive Type"),
        field("Ports"),
        field("Camera"),
        field("Keyboard"),
        field("Keyboard Backlight"),
      ],
    },
    {
      group: "Connectivity Specification",
      items: [field("Communications")],
    },
    {
      group: "Features",
      items: [field("Color"), field("Battery Pack")],
    },
    {
      group: "Operating System",
      items: [field("Operating System")],
    },
    {
      group: "Warranty",
      items: [field("Warranty")],
    },
    {
      group: "Physical Specifications",
      items: [field("Weight"), field("Width X Depth X Height")],
    },
  ];
}

const LEGACY_LAPTOP_SPEC_MAP: Array<{
  from: { group: string; label: string };
  to: { group: string; label: string };
}> = [
  { from: { group: "Processor", label: "Brand" }, to: { group: "Processor Specifications", label: "Processor Brand" } },
  { from: { group: "Processor", label: "Type" }, to: { group: "Processor Specifications", label: "Processor Type" } },
  { from: { group: "Processor", label: "Generation" }, to: { group: "Processor Specifications", label: "Processor Generation" } },
  { from: { group: "Processor", label: "Model" }, to: { group: "Processor Specifications", label: "Processor Model" } },
  { from: { group: "Processor", label: "Speed" }, to: { group: "Processor Specifications", label: "Processor Speed" } },
  { from: { group: "Processor", label: "Cores" }, to: { group: "Processor Specifications", label: "Number Of Cores" } },
  { from: { group: "Processor", label: "Cache" }, to: { group: "Processor Specifications", label: "Processor Cache" } },
  { from: { group: "Memory", label: "Size" }, to: { group: "Memory", label: "Memory Size" } },
  { from: { group: "Memory", label: "Type" }, to: { group: "Memory", label: "Memory Type" } },
  { from: { group: "Graphics", label: "Manufacturer" }, to: { group: "Graphic Card Specifications", label: "Graphic Manufacturer" } },
  { from: { group: "Graphics", label: "Model" }, to: { group: "Graphic Card Specifications", label: "Graphic Card Model" } },
  { from: { group: "Graphics", label: "Type" }, to: { group: "Graphic Card Specifications", label: "Graphic Type" } },
  { from: { group: "Display", label: "Size" }, to: { group: "Display", label: "Display Size" } },
  { from: { group: "Display", label: "Technology" }, to: { group: "Display", label: "Display Technology" } },
  { from: { group: "Display", label: "Resolution" }, to: { group: "Display", label: "Resolution" } },
  { from: { group: "Storage", label: "Type" }, to: { group: "Storage", label: "Storage Technology" } },
  { from: { group: "Storage", label: "Size" }, to: { group: "Storage", label: "Storage Size" } },
  { from: { group: "Connectivity", label: "Wi-Fi" }, to: { group: "Connectivity Specification", label: "Communications" } },
  { from: { group: "Battery & OS", label: "Battery" }, to: { group: "Features", label: "Battery Pack" } },
  { from: { group: "Battery & OS", label: "OS" }, to: { group: "Operating System", label: "Operating System" } },
  { from: { group: "Physical", label: "Weight" }, to: { group: "Physical Specifications", label: "Weight" } },
  { from: { group: "Physical", label: "Dimensions" }, to: { group: "Physical Specifications", label: "Width X Depth X Height" } },
  { from: { group: "Physical", label: "Color" }, to: { group: "Features", label: "Color" } },
];

function specKey(group: string, label: string) {
  return `${group}::${label}`;
}

/** Merge saved specs into template so new fields appear when template is updated. */
export function mergeWithLaptopTemplate(existing: SpecGroup[]): SpecGroup[] {
  const template = createLaptopSpecTemplate();
  const valueByKey = new Map<string, string>();

  for (const g of existing) {
    for (const item of g.items) {
      if (!item.value.trim()) continue;
      valueByKey.set(specKey(g.group, item.label), item.value);
    }
  }

  for (const { from, to } of LEGACY_LAPTOP_SPEC_MAP) {
    const legacy = valueByKey.get(specKey(from.group, from.label));
    const target = specKey(to.group, to.label);
    if (legacy && !valueByKey.has(target)) {
      valueByKey.set(target, legacy);
    }
  }

  return template.map(g => ({
    group: g.group,
    items: g.items.map(item => ({
      label: item.label,
      value: valueByKey.get(specKey(g.group, item.label)) ?? item.value,
    })),
  }));
}

/** Sample laptop specs for seed products and demos. */
export function createSampleLaptopSpecs(): SpecGroup[] {
  const set = (group: string, label: string, value: string) => ({ group, label, value });
  const merged = mergeWithLaptopTemplate([
    {
      group: "Processor Specifications",
      items: [
        set("Processor Specifications", "Processor Brand", "Intel"),
        set("Processor Specifications", "Processor Type", "Intel® Core i5"),
        set("Processor Specifications", "Processor Generation", "13th Generation"),
        set("Processor Specifications", "Processor Model", "i5-13500H"),
        set("Processor Specifications", "Processor Speed", "up to 4.7GHz Max Turbo"),
        set("Processor Specifications", "Number Of Cores", "12 Cores"),
        set("Processor Specifications", "Processor Cache", "18 MB Cache"),
      ],
    },
    {
      group: "Memory",
      items: [
        set("Memory", "Memory Size", "16 GB"),
        set("Memory", "Memory Type", "DDR5"),
      ],
    },
    {
      group: "Graphic Card Specifications",
      items: [
        set("Graphic Card Specifications", "Graphic Manufacturer", "Intel"),
        set("Graphic Card Specifications", "Graphic Memory Size", "Shared Memory"),
        set("Graphic Card Specifications", "Graphic Card Model", "Intel Iris Xe"),
        set("Graphic Card Specifications", "Graphic Type", "Integrated"),
      ],
    },
    {
      group: "Display",
      items: [
        set("Display", "Display Size", "14.0\""),
        set("Display", "Display Technology", "OLED"),
        set("Display", "Display Type", "Full HD+"),
        set("Display", "Resolution", "1920 x 1200"),
      ],
    },
    {
      group: "Storage",
      items: [
        set("Storage", "Storage Technology", "SSD"),
        set("Storage", "Storage Size", "512 GB"),
      ],
    },
    {
      group: "Inputs & Outputs",
      items: [
        set("Inputs & Outputs", "Optical Drive Type", "None"),
        set(
          "Inputs & Outputs",
          "Ports",
          "1x USB-A (USB 5Gbps / USB 3.2 Gen 1) Always On\n2x USB-C® (Thunderbolt™ 4 / USB4® 40Gbps) with USB PD 3.0 and DisplayPort™ 1.4\n1x HDMI® 2.1 up to 4K/60Hz\n1x Headphone / microphone combo jack (3.5mm)",
        ),
        set("Inputs & Outputs", "Camera", "FHD 1080p + IR with Privacy Shutter\nToF Sensor"),
        set("Inputs & Outputs", "Keyboard", "Arabic / English Backlit Keyboard"),
        set("Inputs & Outputs", "Keyboard Backlight", "Yes"),
      ],
    },
    {
      group: "Connectivity Specification",
      items: [
        set("Connectivity Specification", "Communications", "Wi-Fi® 6E\n802.11ax 2x2\nBluetooth® 5.3"),
      ],
    },
    {
      group: "Features",
      items: [
        set("Features", "Color", "Storm Grey"),
        set("Features", "Battery Pack", "65 Whrs Li-ion Battery"),
      ],
    },
    {
      group: "Operating System",
      items: [set("Operating System", "Operating System", "Windows 11 Home")],
    },
    {
      group: "Warranty",
      items: [set("Warranty", "Warranty", "1 Year")],
    },
    {
      group: "Physical Specifications",
      items: [
        set("Physical Specifications", "Weight", "1.35kg"),
        set("Physical Specifications", "Width X Depth X Height", "22.10cm x 31.20cm x 1.49cm"),
      ],
    },
  ]);

  return merged;
}
