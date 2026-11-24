import { ListChecks, Smartphone, WifiOff } from 'lucide-react'
import type { IFeature } from '../types'

export const features: IFeature[] = [
    { icon: <ListChecks size={20} />, title: 'Clear progress', description: 'See completed modules, remaining lessons and exactly what to do next.' },
    { icon: <WifiOff size={20} />, title: 'Light on data', description: 'Text-first lessons, no autoplay, and a low-data mode that hides decorative visuals.' },
    { icon: <Smartphone size={20} />, title: 'Works on any screen', description: 'Designed for phones first, then tablets and desktops.' },
]
