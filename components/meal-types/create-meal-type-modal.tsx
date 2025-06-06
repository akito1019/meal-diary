'use client';

import { useState } from 'react';

interface CreateMealTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export function CreateMealTypeModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateMealTypeModalProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('食事タイプ名を入力してください');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(name.trim());
      setName('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                新しい食事タイプを作成
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  新しい食事タイプの名前を入力してください（例：朝食、昼食、夕食、間食）
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5">
            <div>
              <label htmlFor="meal-type-name" className="block text-sm font-medium text-gray-700">
                食事タイプ名
              </label>
              <input
                type="text"
                id="meal-type-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className={`
                  mt-1 block w-full px-3 py-2 border rounded-md shadow-sm 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500
                  ${error ? 'border-red-500' : 'border-gray-300'}
                  ${isSubmitting ? 'bg-gray-100' : 'bg-white'}
                `}
                placeholder="例：朝食"
                maxLength={20}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className={`
                  w-full inline-flex justify-center rounded-md border border-transparent 
                  shadow-sm px-4 py-2 text-base font-medium text-white 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                  sm:col-start-2 sm:text-sm
                  ${
                    isSubmitting || !name.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}
              >
                {isSubmitting ? (
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : null}
                作成
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}