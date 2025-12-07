import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Meal } from '@/types/fitness';
import { Image, Loader2, Flame, Beef, Wheat, Droplets } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
  mealType: string;
  icon: string;
}

export const MealCard = ({ meal, mealType, icon }: MealCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(meal.imageUrl || null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      const resp = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: meal.name }),
      });

      const body = await resp.json();
      if (resp.ok && body.imageUrl) {
        setImageUrl(body.imageUrl);
      } else if (body.fallback) {
        setImageUrl(body.fallback);
      } else {
        setImageUrl(`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop`);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const speakMeal = async () => {
    const text = `${meal.name}. ${meal.description}`;
    try {
      const resp = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (resp.ok) {
        const { audioUrl } = await resp.json();
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('Server TTS failed, falling back to browser TTS', err);
    }

    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="elevated" className="h-full overflow-hidden">
        {/* Image Section */}
        <div className="relative aspect-video bg-muted">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={meal.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={generateImage}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          )}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full glass text-sm font-medium">
            <span className="mr-1">{icon}</span>
            {mealType}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1">{meal.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{meal.description}</p>

          {/* Nutrition Info */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Flame className="w-4 h-4 mx-auto mb-1 text-accent" />
              <span className="text-xs font-medium block">{meal.calories}</span>
              <span className="text-xs text-muted-foreground">kcal</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Beef className="w-4 h-4 mx-auto mb-1 text-primary" />
              <span className="text-xs font-medium block">{meal.protein}</span>
              <span className="text-xs text-muted-foreground">protein</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Wheat className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
              <span className="text-xs font-medium block">{meal.carbs}</span>
              <span className="text-xs text-muted-foreground">carbs</span>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-500" />
              <span className="text-xs font-medium block">{meal.fats}</span>
              <span className="text-xs text-muted-foreground">fats</span>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Ingredients</h4>
            <div className="flex flex-wrap gap-1">
              {meal.ingredients.map((ingredient, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline" onClick={speakMeal}>
              Speak
            </Button>
            {!imageUrl && (
              <Button size="sm" onClick={generateImage} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
