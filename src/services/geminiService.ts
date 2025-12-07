// src/services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FitnessPlan, UserProfile } from '@/types/fitness';
import { generateFitnessPlanPrompt, parseFitnessPlanResponse } from '@/utils/aiPlanGenerator';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('Gemini API Key missing. Please check your .env file.');
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(apiKey);

export class GeminiService {
  private model;

  constructor() {
    // Use the correct model name for the latest Gemini API
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });
  }

  async generateFitnessPlan(profile: UserProfile): Promise<FitnessPlan> {
    try {
      const prompt = generateFitnessPlanPrompt(profile);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const plan = parseFitnessPlanResponse(text);
      
      if (!plan) {
        throw new Error('Failed to parse AI response');
      }

      return plan;
    } catch (error) {
      console.error('Gemini AI Error:', error);
      throw new Error('Failed to generate fitness plan with AI');
    }
  }

  async generateDietImage(mealDescription: string): Promise<string> {
    try {
      // Note: Gemini Pro doesn't generate images
      // You can integrate with DALL-E, Stable Diffusion, or other image APIs
      
      console.log('Image generation requested for:', mealDescription);
      
      // Placeholder - integrate actual image generation API here
      return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
    } catch (error) {
      console.error('Image generation error:', error);
      throw new Error('Failed to generate meal image');
    }
  }
}

export const geminiService = new GeminiService();