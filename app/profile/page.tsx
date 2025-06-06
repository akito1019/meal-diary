import AppLayout from '@/app/components/layout/AppLayout'

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          プロフィール
        </h1>
        <p className="text-gray-600">
          プロフィール機能は今後実装予定です
        </p>
      </div>
    </AppLayout>
  )
}