export interface Category {
  name: string;
  description: string;
  icon: string;
}

export const categoryList: Category[] = [
  {
    name: "Haircut & Styling",
    description: "Sculptural dry cuts, bespoke layered textures, blowout finishes, and editorial updos.",
    icon: "Scissors",
  },
  {
    name: "Hair Coloring",
    description: "Dimensional balayage, French gloss toners, foilayage, and root melt synchronizations.",
    icon: "Sparkles",
  },
  {
    name: "Hair Treatment",
    description: "Organic keratin infusion, scalp detoxification, and intensive peptide hydration masks.",
    icon: "Flame",
  },
  {
    name: "Facial & Skincare",
    description: "Hydra-infusions, cryo-sculpting massage, lactic renewal peels, and clinical LED therapy.",
    icon: "Smile",
  },
  {
    name: "Makeup",
    description: "Airbrush couture, bridal makeup preview sessions, lash styling, and evening glamour.",
    icon: "Paintbrush",
  },
  {
    name: "Manicure & Pedicure",
    description: "Russian non-invasive cuticle work, bio-gel extensions, and eucalyptus foot bath rituals.",
    icon: "Hand",
  },
  {
    name: "Spa & Massage",
    description: "Deep tissue lymphatic drainage, aromatherapy volcanic stones, and tension relief.",
    icon: "Flower2",
  },
];

export const categoryNames: string[] = categoryList.map((c) => c.name);
