import type { IconName } from './components/ui'
import type { ReactNode } from 'react'

export interface IMenuItem {
    text: string;
    url: string;
    /** Only shown once the learner is signed in. */
    requiresAuth?: boolean;
    /** Match the route exactly (used for the home link). */
    end?: boolean;
}

export interface IHeroBadge {
    icon: ReactNode;
    /** Positioning classes, relative to the portrait circle. */
    className: string;
}

export interface IHeroDetails {
    heading: string[];
    subheading: string;
    primaryCta: { text: string; url: string };
    secondaryCta: { text: string; targetId: string };
    imageSrc: string;
    imageAlt: string;
    badges: IHeroBadge[];
}

export interface IStat {
    label: string;
    value: number;
}

export interface IStep {
    title: string;
    description: string;
}

export interface IFeature {
    title: string;
    description: string;
    icon: ReactNode;
}

export interface ICta {
    heading: string;
    description: string;
}

export interface IAuthCopy {
    kicker: string;
    title: string;
    submit: string;
    swapPrompt: string;
    swapLabel: string;
    note: string;
}

export interface IAboutFeature {
    title: string;
    description: string;
    icon: IconName;
}

export interface IAbout {
    label: string;
    heading: string[];
    bullets: string[];
    paragraphs: string[];
    features: IAboutFeature[];
}
