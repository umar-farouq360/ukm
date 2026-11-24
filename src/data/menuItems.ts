import type { IMenuItem } from '../types'

export const menuItems: IMenuItem[] = [
    { text: 'Home', url: '/', end: true },
    { text: 'Courses', url: '/courses' },
    { text: 'My learning', url: '/dashboard', requiresAuth: true },
    { text: 'Certificates', url: '/certificates', requiresAuth: true },
]
