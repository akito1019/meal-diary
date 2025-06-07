import { openai } from '@/lib/openai/client';
import { IMAGE_SIMILARITY_PROMPT } from './prompts';

interface ImageSimilarityResult {
  similarity_score: number;
  reasoning: string;
  food_category_match: boolean;
  visual_similarity: number;
}

export async function compareImages(
  currentImageUrl: string,
  pastImageUrl: string
): Promise<ImageSimilarityResult | null> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: IMAGE_SIMILARITY_PROMPT
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Compare these two food images and rate their similarity:'
            },
            {
              type: 'text',
              text: 'Current image:'
            },
            {
              type: 'image_url',
              image_url: {
                url: currentImageUrl,
                detail: 'low' // 低解像度で高速化
              }
            },
            {
              type: 'text',
              text: 'Past image to compare:'
            },
            {
              type: 'image_url',
              image_url: {
                url: pastImageUrl,
                detail: 'low'
              }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
      temperature: 0.1
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return null;
    }

    const result = JSON.parse(content) as ImageSimilarityResult;
    return result;
  } catch (error) {
    console.error('Error comparing images:', error);
    return null;
  }
}

export async function findSimilarMealsByImage(
  currentImageUrl: string,
  pastMeals: any[],
  minSimilarity: number = 0.3,
  maxResults: number = 3
): Promise<any[]> {
  const similarityPromises = pastMeals.map(async (meal) => {
    if (!meal.image_url) return null;
    
    const similarity = await compareImages(currentImageUrl, meal.image_url);
    if (!similarity || similarity.similarity_score < minSimilarity) {
      return null;
    }
    
    return {
      ...meal,
      similarity_score: similarity.similarity_score,
      similarity_reasoning: similarity.reasoning,
      visual_similarity: similarity.visual_similarity,
      food_category_match: similarity.food_category_match
    };
  });

  const results = await Promise.all(similarityPromises);
  
  return results
    .filter((result): result is NonNullable<typeof result> => result !== null)
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, maxResults);
}