import {
  ShieldCheck,
  BadgeDollarSign,
  CalendarCheck,
  CreditCard,
} from "lucide-react"

interface WhyChooseUsItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export const whyChooseUsData: WhyChooseUsItem[] = [
  {
    icon: ShieldCheck,
    title: "100% Verified Reviews",
    description:
      "Only clients who completed a verified appointment checkout can rate and review their stylist.",
  },
  {
    icon: BadgeDollarSign,
    title: "Transparent Upfront Pricing",
    description:
      "No hidden add-on surprises at the chair. Know exact service durations and total costs upfront.",
  },
  {
    icon: CalendarCheck,
    title: "Flexible Rescheduling",
    description:
      "Manage appointments with ease. One-tap cancellation or rebooking right from your customer dashboard.",
  },
  {
    icon: CreditCard,
    title: "Encrypted Stripe Pay",
    description:
      "Seamless and safe card payments with automated webhook confirmations and digital receipt history.",
  },
]