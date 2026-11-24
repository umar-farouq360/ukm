import type { IAuthCopy } from '../types'

export const authCopy: Record<'login' | 'register', IAuthCopy> = {
    login: {
        kicker: 'Log in to',
        title: 'Log in',
        submit: 'Log in',
        swapPrompt: "Don't have an account?",
        swapLabel: 'Sign up',
        note: 'Accounts made in this browser accept any password of 8+ characters.',
    },
    register: {
        kicker: 'Sign up to',
        title: 'Sign up',
        submit: 'Create account',
        swapPrompt: 'Already have an account?',
        swapLabel: 'Log in',
        note: 'Demonstration only. Details stay in this browser and are never sent anywhere. Please use made-up details.',
    },
}

export const authArtCaption = { before: 'Open campus', by: 'by', author: 'UKM University' }
