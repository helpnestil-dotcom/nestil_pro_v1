import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nestil Property Marketplace',
    short_name: 'Nestil',
    description: 'Buy, Rent & Sell premium properties directly from owners across Andhra Pradesh.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617', // Match the new slate-950 dark theme
    theme_color: '#3B82F6', // Primary brand color
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
