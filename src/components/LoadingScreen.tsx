import { motion } from 'framer-motion';
import { Loader2, Sparkles, Dumbbell, Utensils, Brain } from 'lucide-react';

const loadingMessages = [
  { icon: Brain, text: "Analyzing your profile..." },
  { icon: Dumbbell, text: "Crafting your workout plan..." },
  { icon: Utensils, text: "Designing your meal plan..." },
  { icon: Sparkles, text: "Adding final touches..." },
];

interface LoadingScreenProps {
  currentStep?: number;
}

export const LoadingScreen = ({ currentStep = 0 }: LoadingScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="text-center max-w-md px-4">
        {/* Animated Icon */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 mx-auto mb-8 rounded-3xl gradient-primary flex items-center justify-center shadow-glow"
        >
          <Dumbbell className="w-12 h-12 text-primary-foreground" />
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-4"
        >
          Creating Your Plan
        </motion.h2>

        {/* Progress Steps */}
        <div className="space-y-3 mb-8">
          {loadingMessages.map((message, index) => (
            <motion.div
              key={message.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: index * 0.5, duration: 0.3 }}
              className={`flex items-center gap-3 justify-center ${
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {index < currentStep ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              ) : index === currentStep ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-muted" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
