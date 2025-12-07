import { motion } from 'framer-motion';
import { Dumbbell, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFitnessStore } from '@/store/fitnessStore';

export const Header = () => {
  const { isDarkMode, toggleDarkMode } = useFitnessStore();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">FitGenius AI</span>
        </motion.div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDarkMode ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-accent" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </motion.div>
        </Button>
      </div>
    </motion.header>
  );
};
