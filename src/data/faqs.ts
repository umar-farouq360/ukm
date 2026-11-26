import { CATEGORIES, COURSES } from './courses'

export interface IFaq {
    question: string;
    answer: string;
}

export const faqDetails = {
    heading: 'FAQs',
}

const free = COURSES.filter((c) => c.price === 0).length

export const faqs: IFaq[] = [
    {
        question: 'What is UKM University?',
        answer: 'UKM University is an online learning and skills development platform. Learners discover courses, enrol, learn at their own pace, track progress and earn certificates. It is a fictional institution created for a design competition, so all courses and people are demonstration data.',
    },
    {
        question: 'How do I enrol in a course?',
        answer: 'Open a course, press Enrol, then sign in or create an account. Check the details and confirm. Free courses start straight away. For paid courses the fee is shown before you confirm, and payment is simulated in this demo.',
    },
    {
        question: 'Are there free courses?',
        answer: `Yes. ${free} of our ${COURSES.length} courses are free. For every other course the fee is shown on the course page, before you enrol.`,
    },
    {
        question: 'Which programmes can I choose?',
        answer: `There are ${CATEGORIES.length} programme categories: ${CATEGORIES.map((c) => c.short).join(', ')}. Use the categories on the home page or the filters on the courses page to find what suits you.`,
    },
    {
        question: 'How do I earn a certificate?',
        answer: 'Complete every lesson in a course. When the last lesson is marked complete, the course counts as finished and your certificate appears on the Certificates page.',
    },
    {
        question: 'Can I learn on my phone?',
        answer: 'Yes. The platform is designed for phones first, then tablets and desktops, so you can study on whichever device you have.',
    },
    {
        question: 'What is low-data mode?',
        answer: 'Low-data mode hides decorative visuals so pages load lighter on a slow or expensive connection. Lessons are text-first already. Turn it on or off with the signal icon in the top menu.',
    },
    {
        question: 'Can I study at my own pace?',
        answer: 'Yes. Your progress is saved in your browser, so you can stop at any time and the course resumes at the lesson you were on.',
    },
    {
        question: 'How can I get help?',
        answer: 'Open the learning assistant from the green button at the bottom of the page. Ask about courses, fees, enrolment or your progress. In this demo it gives scripted answers from the sample data.',
    },
]
