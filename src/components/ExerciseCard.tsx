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
      // This will be connected to the AI image generation API
      // For now, we'll simulate with a placeholder
      await new Promise(resolve => setTimeout(resolve, 2000));
      setImageUrl(`https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop`);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
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
        </CardContent>
      </Card>
    </motion.div>
  );
};
