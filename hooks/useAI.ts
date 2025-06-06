'use client';

import { useState, useCallback } from 'react';
import { MealAnalysisRequest, MealAnalysisResponse } from '@/types/ai';

interface UseAIReturn {
  analyzing: boolean;
  error: string | null;
  analyzeImage: (request: MealAnalysisRequest) => Promise<MealAnalysisResponse>;
}

export const useAI = (): UseAIReturn => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (request: MealAnalysisRequest): Promise<MealAnalysisResponse> => {
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: MealAnalysisResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setAnalyzing(false);
    }
  }, []);

  return {
    analyzing,
    error,
    analyzeImage
  };
};