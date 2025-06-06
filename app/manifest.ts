import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Meal Diary - 食事記録アプリ',
    short_name: 'Meal Diary',
    description: 'AI画像認識機能付きの食事記録アプリ。筋トレ・体づくりをサポートし、栄養管理を簡単に。',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait',
    scope: '/',
    lang: 'ja',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    categories: ['health', 'fitness', 'lifestyle'],
    shortcuts: [
      {
        name: '新しい食事記録',
        short_name: '記録',
        description: '新しい食事を記録する',
        url: '/meals/new',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
      }
    ]
  }
}