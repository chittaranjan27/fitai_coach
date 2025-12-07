import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Exercise } from '@/types/fitness';
import { Image, Loader2, Timer, RotateCcw } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export const ExerciseCard = ({ exercise, index }: ExerciseCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(exercise.imageUrl || null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    setIsGenerating(true);
    try {
      // Call server endpoint to generate image. The server will attempt to use
      // a real image-generation API (Replicate, etc.) when configured.
      const resp = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: exercise.name }),
      });

      const body = await resp.json();
      if (resp.ok && body.imageUrl) {
        setImageUrl(body.imageUrl);
      } else if (body.fallback) {
        // Server returned a configured fallback image URL
        setImageUrl(body.fallback);
      } else {
        // Last resort placeholder
        setImageUrl(`https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop`);
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const speakInstructions = async () => {
    const text = `${exercise.name}. ${exercise.instructions}`;
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

    // Fallback: use browser SpeechSynthesis
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card variant="glass" className="h-full">
        <CardContent className="p-4">
          {/* Image Section */}
          <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={exercise.name}
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
          </div>

          {/* Exercise Info */}
          <h4 className="font-bold text-lg mb-2">{exercise.name}</h4>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
              {exercise.sets} sets
            </span>
            <span className="px-2 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              {exercise.reps}
            </span>
            <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {exercise.restTime} rest
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" onClick={speakInstructions}>
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
