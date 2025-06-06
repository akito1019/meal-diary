export interface MealAnalysisRequest {
  imageUrl: string;
  additionalContext?: string;
}

export interface MealAnalysisAlternative {
  name: string;
  calories: number;
  confidence: number;
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