import { motion } from 'framer-motion';
import { Dumbbell, Sparkles, Zap, Heart, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const features = [
    { icon: Dumbbell, label: 'Personalized Workouts' },
    { icon: Zap, label: 'AI-Powered Plans' },
    { icon: Heart, label: 'Custom Diet Plans' },
    { icon: Brain, label: 'Smart Recommendations' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">AI-Powered Fitness Revolution</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
        >
          Your Personal
          <br />
          <span className="gradient-text">AI Fitness Coach</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          Get personalized workout and diet plans tailored to your goals, body type, and preferences. 
          Powered by advanced AI for maximum results.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            variant="gradient"
            size="xl"
            onClick={onGetStarted}
            className="gap-3 animate-pulse-glow"
          >
            <Sparkles className="w-5 h-5" />
            Start Your Transformation
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl glass"
            >
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-center">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
