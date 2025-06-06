export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      meal_types: {
        Row: {
          id: string
          user_id: string
          name: string
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          meal_type_id: string
          image_url: string
          meal_name: string
          calories: number | null
          protein: number | null
          fat: number | null
          carbs: number | null
          memo: string | null
          recorded_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_type_id: string
          image_url: string
          meal_name: string
          calories?: number | null
          protein?: number | null
          fat?: number | null
          carbs?: number | null
          memo?: string | null
          recorded_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          meal_type_id?: string
          image_url?: string
          meal_name?: string
          calories?: number | null
          protein?: number | null
          fat?: number | null
          carbs?: number | null
          memo?: string | null
          recorded_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      meal_suggestions: {
        Row: {
          id: string
          meal_id: string
          suggestion_name: string
          confidence: number
          selected: boolean
          created_at: string
        }
        Insert: {
          id?: string
          meal_id: string
          suggestion_name: string
          confidence: number
          selected?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          meal_id?: string
          suggestion_name?: string
          confidence?: number
          selected?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}