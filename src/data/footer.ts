import { CATEGORIES } from './courses'

export const footerDetails = {
    siteName: 'UKM University',
    copyright: `Copyright © ${new Date().getFullYear()} UKM University. Demonstration only.`,
}

// Dark call-to-action card above the footer.
export const footerCta = {
    heading: 'Ready to start learning?',
    description: 'Leave your email address below and we will send you updates about new courses and intakes. This is a demo, so nothing is actually sent.',
    placeholder: 'Enter your email',
    button: 'Send',
    success: 'Thanks! This is a demo, so your email was not sent anywhere.',
}

export const footerColumns = {
    explore: {
        title: 'What’s UKM',
        links: [
            { text: 'Programmes', url: '/courses' },
            { text: 'Learning assistant', url: 'assistant' }, // opens the chat instead of navigating
        ],
        featured: { text: 'All courses', url: '/courses' },
    },
    contact: {
        title: 'Contact us',
        links: [
            { text: 'Ask the assistant', url: 'assistant' },
            { text: 'About this demo', url: '/about-demo' },
        ],
    },
    newsletter: {
        title: 'Interested in learning with UKM?',
        placeholder: 'Enter your email',
        button: 'Send',
    },
}

export const programmeLinks = CATEGORIES.map((c) => ({ text: c.short, url: `/courses?category=${c.id}` }))

export const footerLegal = [
    { text: 'About this demo', url: '/about-demo' },
    { text: 'Log in', url: '/login' },
    { text: 'Sign up', url: '/register' },
]
