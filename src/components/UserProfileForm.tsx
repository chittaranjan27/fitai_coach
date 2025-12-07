// src/components/UserProfileForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile } from '@/types/fitness';

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
  onBack: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit, onBack }) => {
  const { register, handleSubmit, setValue, watch } = useForm<UserProfile>();

  const onFormSubmit = (data: UserProfile) => {
    onSubmit(data);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-3xl shadow-2xl border border-border p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Step 1: Your Profile</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Tell Us About Yourself</h2>
            <p className="text-muted-foreground">
              Help us create the perfect fitness plan for you
            </p>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: true })}
                  placeholder="John Doe"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  {...register('age', { required: true, min: 13, max: 100 })}
                  placeholder="25"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(value) => setValue('gender', value)} required>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  {...register('height', { required: true, min: 100, max: 250 })}
                  placeholder="175"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  {...register('weight', { required: true, min: 30, max: 300 })}
                  placeholder="70"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="fitnessLevel">Fitness Level *</Label>
                <Select onValueChange={(value) => setValue('fitnessLevel', value)} required>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fitnessGoal">Fitness Goal *</Label>
                <Select onValueChange={(value) => setValue('fitnessGoal', value)} required>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="general_fitness">General Fitness</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workoutLocation">Workout Location *</Label>
                <Select onValueChange={(value) => setValue('workoutLocation', value)} required>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dietaryPreference">Dietary Preference *</Label>
                <Select onValueChange={(value) => setValue('dietaryPreference', value)} required>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sleepHours">Average Sleep (hours)</Label>
                <Input
                  id="sleepHours"
                  type="number"
                  {...register('sleepHours', { min: 1, max: 24 })}
                  placeholder="7"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="stressLevel">Stress Level</Label>
                <Select onValueChange={(value) => setValue('stressLevel', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="medicalHistory">Medical History / Notes (Optional)</Label>
              <Textarea
                id="medicalHistory"
                {...register('medicalHistory')}
                placeholder="Any injuries, conditions, or notes we should know about..."
                className="mt-2"
                rows={4}
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Generate My AI Fitness Plan
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfileForm;