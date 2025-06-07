import { createServerClient } from '@/lib/supabase/server';
import { openai } from '@/lib/openai/client';
import { generateAnalysisPrompt, MEAL_ANALYSIS_USER_PROMPT } from '@/lib/ai/prompts';
import { MealAnalysisRequest, MealAnalysisResult, MealAnalysisResponse, AIServiceError } from '@/types/ai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return Response.json(
        { 
          success: false, 
          error: 'Unauthorized' 
        } as MealAnalysisResponse,
        { status: 401 }
      );
    }

    const body: MealAnalysisRequest = await request.json();
    
    if (!body.imageUrl) {
      return Response.json(
        { 
          success: false, 
          error: 'Image URL is required' 
        } as MealAnalysisResponse,
        { status: 400 }
      );
    }

    const systemPrompt = generateAnalysisPrompt(body.additionalContext);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: MEAL_ANALYSIS_USER_PROMPT
            },
            {
              type: 'image_url',
              image_url: {
                url: body.imageUrl,
                detail: 'high'
              }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1200,
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    const analysisResult = JSON.parse(content) as MealAnalysisResult;
    
    const processingTime = Date.now() - startTime;

    return Response.json({
      success: true,
      data: analysisResult,
      processingTime
    } as MealAnalysisResponse);

  } catch (error) {
    console.error('Error analyzing meal:', error);
    
    const processingTime = Date.now() - startTime;
    
    let aiError: AIServiceError;
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        aiError = {
          code: 'RATE_LIMIT',
          message: 'API rate limit exceeded. Please try again later.',
          details: error.message
        };
      } else if (error.message.includes('invalid') || error.message.includes('image')) {
        aiError = {
          code: 'INVALID_IMAGE',
          message: 'Invalid image format or URL.',
          details: error.message
        };
      } else if (error.message.includes('API')) {
        aiError = {
          code: 'API_ERROR',
          message: 'External API error occurred.',
          details: error.message
        };
      } else {
        aiError = {
          code: 'UNKNOWN',
          message: error.message,
          details: error.stack
        };
      }
    } else {
      aiError = {
        code: 'UNKNOWN',
        message: 'An unexpected error occurred.',
        details: error
      };
    }
    
    return Response.json(
      { 
        success: false, 
        error: aiError.message,
        processingTime
      } as MealAnalysisResponse,
      { status: 500 }
    );
  }
}