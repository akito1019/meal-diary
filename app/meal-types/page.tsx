'use client';

import { useState } from 'react';
import AppLayout from '@/app/components/layout/AppLayout';
import { useMealTypes } from '@/hooks/use-meal-types';
import { CreateMealTypeModal } from '@/components/meal-types/create-meal-type-modal';
import { SortableMealTypeList } from '@/components/meal-types/sortable-meal-type-list';

export default function MealTypesPage() {
  const {
    mealTypes,
    loading,
    error,
    createMealType,
    updateMealType,
    deleteMealType,
    reorderMealTypes,
  } = useMealTypes();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);

  const handleCreate = async (name: string) => {
    await createMealType(name);
  };

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleUpdate = async () => {
    if (!editingId || !editingName.trim()) return;

    try {
      setIsUpdating(true);
      await updateMealType(editingId, { name: editingName.trim() });
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Failed to update meal type:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この食事タイプを削除しますか？関連する食事記録がある場合は削除できません。')) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteMealType(id);
    } catch (error) {
      console.error('Failed to delete meal type:', error);
      alert(error instanceof Error ? error.message : '削除に失敗しました');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">食事タイプを読み込んでいます...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">エラーが発生しました: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              再読み込み
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">食事タイプ管理</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新規作成
          </button>
        </div>

        {mealTypes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">まだ食事タイプがありません</h3>
            <p className="text-gray-500 mb-6">最初の食事タイプを作成してみましょう</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              食事タイプを作成
            </button>
          </div>
        ) : (
          <SortableMealTypeList
            mealTypes={mealTypes}
            onReorder={reorderMealTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isReorderMode={isReorderMode}
            onToggleReorderMode={() => setIsReorderMode(!isReorderMode)}
          />
        )}

        {editingId && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">食事タイプを編集</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUpdating}
                placeholder="食事タイプ名"
              />
              <button
                onClick={handleUpdate}
                disabled={isUpdating || !editingName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {isUpdating ? '保存中...' : '保存'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        <CreateMealTypeModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
        />
      </div>
    </AppLayout>
  );
}