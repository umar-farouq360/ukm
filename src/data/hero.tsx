import { Award, GraduationCap } from "lucide-react";
import type { IHeroDetails } from "../types";

const glass =
  "absolute size-[23%] rounded-[24%] grid place-items-center text-white backdrop-blur-sm shadow-lg";

export const heroDetails: IHeroDetails = {
  heading: ["Start Learning", "Deeper together"],
  subheading:
    "Undergraduate, Masters, postgraduate and certificate courses in one lightweight platform, built for any device and any connection.",
  primaryCta: { text: "Explore courses", url: "/courses" },
  secondaryCta: { text: "Learn More", targetId: "how" },
  imageSrc: "/hero-student.png",
  imageAlt: "A smiling UKM student holding course folders",
  badges: [
    {
      icon: <GraduationCap className="size-[48%]" strokeWidth={1.5} />,
      className: `${glass} left-[6%] top-[12%]`,
    },
    {
      icon: <Award className="size-[48%]" strokeWidth={1.5} />,
      className: `${glass} left-[74%] top-[61%]`,
    },
  ],
};
