-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create meal_types table
CREATE TABLE meal_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create meals table
CREATE TABLE meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type_id UUID NOT NULL REFERENCES meal_types(id) ON DELETE RESTRICT,
  image_url TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  calories INTEGER,
  protein DECIMAL(10,2),
  fat DECIMAL(10,2),
  carbs DECIMAL(10,2),
  memo TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create meal_suggestions table
CREATE TABLE meal_suggestions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  suggestion_name TEXT NOT NULL,
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  selected BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_recorded_at ON meals(recorded_at);
CREATE INDEX idx_meal_types_user_id ON meal_types(user_id);
CREATE INDEX idx_meal_suggestions_meal_id ON meal_suggestions(meal_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_types_updated_at BEFORE UPDATE ON meal_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_suggestions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Meal types policies
CREATE POLICY "Users can view own meal types" ON meal_types
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own meal types" ON meal_types
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal types" ON meal_types
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal types" ON meal_types
  FOR DELETE USING (auth.uid() = user_id);

-- Meals policies
CREATE POLICY "Users can view own meals" ON meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own meals" ON meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals" ON meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals" ON meals
  FOR DELETE USING (auth.uid() = user_id);

-- Meal suggestions policies
CREATE POLICY "Users can view suggestions for own meals" ON meal_suggestions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_suggestions.meal_id
      AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create suggestions for own meals" ON meal_suggestions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_suggestions.meal_id
      AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update suggestions for own meals" ON meal_suggestions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM meals
      WHERE meals.id = meal_suggestions.meal_id
      AND meals.user_id = auth.uid()
    )
  );

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create default meal types for new users
CREATE OR REPLACE FUNCTION public.create_default_meal_types()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.meal_types (user_id, name, display_order)
  VALUES 
    (NEW.id, '朝食', 1),
    (NEW.id, '昼食', 2),
    (NEW.id, '夕食', 3),
    (NEW.id, '間食', 4),
    (NEW.id, 'プロテイン', 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_meal_types();