import { ListChecks, Smartphone, WifiOff } from "lucide-react";
import type { ReactNode } from "react";

export interface IBenefit {
  title: string;
  description: string;
  icon: ReactNode;
  /** CSS gradient for the round icon background. */
  gradient: string;
}

export const benefitsDetails = {
  heading: "Benefits From Our Online Learning",
  image: "/benefits-learner.png",
  imageAlt: "A learner sitting cross-legged with a laptop",
};

const icon = "size-[46%]";

export const benefits: IBenefit[] = [
  {
    title: "Clear progress",
    description:
      "See completed modules, remaining lessons and exactly what to do next.",
    icon: <ListChecks className={icon} strokeWidth={1.5} />,
    gradient: "linear-gradient(160deg, #F7806F 0%, #EE6F77 55%, #F0A29A 100%)",
  },
  {
    title: "Light on data",
    description:
      "Text-first lessons, no autoplay, and a low-data mode that hides decorative visuals.",
    icon: <WifiOff className={icon} strokeWidth={1.5} />,
    gradient: "linear-gradient(160deg, #C9A6F6 0%, #D6BDF7 60%, #DDD0F2 100%)",
  },
  {
    title: "Works on any screen",
    description: "Designed for phones first, then tablets and desktops.",
    icon: <Smartphone className={icon} strokeWidth={1.5} />,
    gradient: "linear-gradient(160deg, #62D3A0 0%, #8FE2BE 60%, #C4F0DC 100%)",
  },
];
