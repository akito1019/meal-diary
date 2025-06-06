'use client';

import { useState } from 'react';
import { Database } from '@/types/database';
import { MealTypeBadge } from './meal-type-badge';

type MealType = Database['public']['Tables']['meal_types']['Row'];

interface SortableMealTypeListProps {
  mealTypes: MealType[];
  onReorder: (mealTypeIds: string[]) => Promise<void>;
  onEdit?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
  isReorderMode: boolean;
  onToggleReorderMode: () => void;
}

export function SortableMealTypeList({
  mealTypes,
  onReorder,
  onEdit,
  onDelete,
  isReorderMode,
  onToggleReorderMode,
}: SortableMealTypeListProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(id);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    try {
      setIsReordering(true);
      
      const currentOrder = [...mealTypes];
      const draggedIndex = currentOrder.findIndex(item => item.id === draggedItem);
      const targetIndex = currentOrder.findIndex(item => item.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const [removed] = currentOrder.splice(draggedIndex, 1);
      currentOrder.splice(targetIndex, 0, removed);

      const newOrder = currentOrder.map(item => item.id);
      await onReorder(newOrder);
    } catch (error) {
      console.error('Failed to reorder meal types:', error);
    } finally {
      setDraggedItem(null);
      setDragOverItem(null);
      setIsReordering(false);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const moveUp = async (id: string) => {
    const currentIndex = mealTypes.findIndex(item => item.id === id);
    if (currentIndex <= 0) return;

    const newOrder = [...mealTypes];
    [newOrder[currentIndex - 1], newOrder[currentIndex]] = [newOrder[currentIndex], newOrder[currentIndex - 1]];
    
    try {
      setIsReordering(true);
      await onReorder(newOrder.map(item => item.id));
    } catch (error) {
      console.error('Failed to move item up:', error);
    } finally {
      setIsReordering(false);
    }
  };

  const moveDown = async (id: string) => {
    const currentIndex = mealTypes.findIndex(item => item.id === id);
    if (currentIndex >= mealTypes.length - 1) return;

    const newOrder = [...mealTypes];
    [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
    
    try {
      setIsReordering(true);
      await onReorder(newOrder.map(item => item.id));
    } catch (error) {
      console.error('Failed to move item down:', error);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          食事タイプ一覧
        </h3>
        <button
          onClick={onToggleReorderMode}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isReorderMode
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isReorderMode ? '完了' : '並び順変更'}
        </button>
      </div>

      {isReorderMode && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <p className="text-sm text-blue-700">
            ドラッグ&ドロップまたは矢印ボタンで並び順を変更できます
          </p>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {mealTypes.map((type, index) => (
          <div
            key={type.id}
            draggable={isReorderMode}
            onDragStart={(e) => handleDragStart(e, type.id)}
            onDragOver={(e) => handleDragOver(e, type.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, type.id)}
            onDragEnd={handleDragEnd}
            className={`
              px-6 py-4 flex items-center justify-between transition-colors
              ${isReorderMode ? 'cursor-move hover:bg-gray-50' : 'hover:bg-gray-50'}
              ${draggedItem === type.id ? 'opacity-50' : ''}
              ${dragOverItem === type.id ? 'bg-blue-50' : ''}
              ${isReordering ? 'pointer-events-none' : ''}
            `}
          >
            <div className="flex items-center space-x-4">
              {isReorderMode && (
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => moveUp(type.id)}
                    disabled={index === 0 || isReordering}
                    className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveDown(type.id)}
                    disabled={index === mealTypes.length - 1 || isReordering}
                    className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}

              {isReorderMode && (
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 min-w-[2rem]">
                  {type.display_order}
                </span>
                <MealTypeBadge name={type.name} />
              </div>
            </div>

            {!isReorderMode && (
              <div className="flex items-center space-x-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(type.id, type.name)}
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    編集
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(type.id)}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    削除
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isReordering && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
            <span className="text-sm text-gray-600">並び順を更新しています...</span>
          </div>
        </div>
      )}
    </div>
  );
}