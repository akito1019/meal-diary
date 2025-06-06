'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meal Diary
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI画像認識付き食事記録アプリ
          </p>
          
          {/* Tailwind Test */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">
              スタイルテスト
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h3 className="text-primary-800 font-medium">カラー1</h3>
                <p className="text-primary-600">Primary 50</p>
              </div>
              <div className="bg-primary-500 text-white rounded-lg p-4">
                <h3 className="font-medium">カラー2</h3>
                <p>Primary 500</p>
              </div>
              <div className="bg-primary-900 text-white rounded-lg p-4">
                <h3 className="font-medium">カラー3</h3>
                <p>Primary 900</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/auth/login"
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ログイン
            </h3>
            <p className="text-gray-600">
              アカウントにサインインして食事記録を始めましょう
            </p>
          </Link>

          <Link 
            href="/auth/register"
            className="block bg-primary-600 text-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
          >
            <h3 className="text-xl font-semibold mb-2">
              新規登録
            </h3>
            <p>
              新しくアカウントを作成して始める
            </p>
          </Link>

          <Link 
            href="/meals/new"
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              食事を記録
            </h3>
            <p className="text-gray-600">
              新しい食事を写真付きで記録する
            </p>
          </Link>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              機能一覧
            </h3>
            <ul className="text-gray-600 space-y-1">
              <li>📸 写真アップロード</li>
              <li>🤖 AI画像認識</li>
              <li>📊 栄養情報記録</li>
              <li>📅 カレンダー表示</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}