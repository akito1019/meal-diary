export interface MealAnalysisRequest {
  imageUrl: string;
  additionalContext?: string;
}

export interface MealAnalysisAlternative {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export interface PastMealSuggestion {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  memo?: string;
  image_url?: string;
  recorded_at: string;
  similarity_score?: number;
  similarity_reasoning?: string;
  meal_types?: {
    id: string;
    name: string;
  };
}

export interface MealAnalysisResult {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  alternatives?: MealAnalysisAlternative[];
  pastMealSuggestions?: PastMealSuggestion[];
  portionSize?: string;
  ingredients?: string[];
}

export interface MealAnalysisResponse {
  success: boolean;
  data?: MealAnalysisResult;
  error?: string;
  processingTime?: number;
}

export interface AIServiceError {
  code: 'INVALID_IMAGE' | 'API_ERROR' | 'RATE_LIMIT' | 'UNAUTHORIZED' | 'UNKNOWN';
  message: string;
  details?: any;
}