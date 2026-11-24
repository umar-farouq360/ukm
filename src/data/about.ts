import type { IconName } from "../components/ui";
import { heroDetails } from "./hero";

interface IAboutFeature {
  title: string;
  description: string;
  icon: IconName;
}

interface IAbout {
  label: string;
  heading: string[];
  bullets: string[];
  paragraphs: string[];
  features: IAboutFeature[];
}

export const aboutDetails: IAbout = {
  label: "About UKM University",
  heading: ["Learning that fits", "around your life"],
  bullets: [
    "Self-paced courses you can start any time",
    "Clear progress on every lesson",
    "Certificates you can share",
  ],
  paragraphs: [
    heroDetails.subheading,
    "UKM University is an online learning and skills development platform. Discover a course, enrol in a few steps, follow lessons at your own pace and earn a certificate when you finish.",
  ],
  features: [
    {
      icon: "clock",
      title: "Learn at your pace",
      description: "Short lessons you can pick up and put down.",
    },
    {
      icon: "award",
      title: "Earn certificates",
      description: "Finish a course and get a certificate you can share.",
    },
    {
      icon: "bolt",
      title: "Light on data",
      description: "Text-first lessons and a low-data mode.",
    },
    {
      icon: "globe",
      title: "Any device",
      description: "Built for phones first, then tablets and desktops.",
    },
  ],
};
