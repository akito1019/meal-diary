import { useState, useEffect, useCallback } from 'react';
import { Database } from '@/types/database';

type MealType = Database['public']['Tables']['meal_types']['Row'];

export function useMealTypes() {
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMealTypes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/meal-types');
      
      if (!response.ok) {
        throw new Error('Failed to fetch meal types');
      }

      const data = await response.json();
      setMealTypes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMealType = async (name: string) => {
    try {
      const response = await fetch('/api/meal-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create meal type');
      }

      const newMealType = await response.json();
      setMealTypes(prev => [...prev, newMealType]);
      return newMealType;
    } catch (err) {
      throw err;
    }
  };

  const updateMealType = async (id: string, data: { name?: string; display_order?: number }) => {
    try {
      const response = await fetch(`/api/meal-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update meal type');
      }

      const updatedMealType = await response.json();
      setMealTypes(prev => prev.map(type => 
        type.id === id ? updatedMealType : type
      ));
      return updatedMealType;
    } catch (err) {
      throw err;
    }
  };

  const deleteMealType = async (id: string) => {
    try {
      const response = await fetch(`/api/meal-types/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete meal type');
      }

      setMealTypes(prev => prev.filter(type => type.id !== id));
      await fetchMealTypes();
    } catch (err) {
      throw err;
    }
  };

  const reorderMealTypes = async (mealTypeIds: string[]) => {
    try {
      const response = await fetch('/api/meal-types/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealTypeIds }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reorder meal types');
      }

      const updatedTypes = await response.json();
      setMealTypes(updatedTypes);
      return updatedTypes;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchMealTypes();
  }, [fetchMealTypes]);

  return {
    mealTypes,
    loading,
    error,
    refetch: fetchMealTypes,
    createMealType,
    updateMealType,
    deleteMealType,
    reorderMealTypes,
  };
}