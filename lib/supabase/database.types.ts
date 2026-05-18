export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
      };
      dogs: {
        Row: {
          id: string;
          created_at: string | null;
          nombre: string;
          peso: number | null;
          edad: string | null;
          tamaño: string | null;
          actividad: string | null;
          estado_fisico: string | null;
          user_id: string;
          photo_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          nombre: string;
          peso?: number | null;
          edad?: string | null;
          tamaño?: string | null;
          actividad?: string | null;
          estado_fisico?: string | null;
          user_id: string;
          photo_url?: string | null;
        };
        Update: {
          nombre?: string;
          peso?: number | null;
          edad?: string | null;
          tamaño?: string | null;
          actividad?: string | null;
          estado_fisico?: string | null;
          photo_url?: string | null;
        };
      };
      food_calculations: {
        Row: {
          id: string;
          created_at: string | null;
          user_id: string;
          dog_id: string;
          gramos_diarios: number;
          gramos_mensuales: number;
          peso: number | null;
          edad: string | null;
          actividad: string | null;
          estado_fisico: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          user_id: string;
          dog_id: string;
          gramos_diarios: number;
          gramos_mensuales: number;
          peso?: number | null;
          edad?: string | null;
          actividad?: string | null;
          estado_fisico?: string | null;
        };
        Update: {
          gramos_diarios?: number;
          gramos_mensuales?: number;
          peso?: number | null;
          edad?: string | null;
          actividad?: string | null;
          estado_fisico?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          created_at: string | null;
          user_id: string;
          body: string;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          user_id: string;
          body: string;
        };
        Update: {
          body?: string;
        };
      };
      comment_likes: {
        Row: {
          id: string;
          created_at: string | null;
          user_id: string;
          comment_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          user_id: string;
          comment_id: string;
        };
        Update: Record<string, never>;
      };
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Dog = Database["public"]["Tables"]["dogs"]["Row"];
export type FoodCalculation = Database["public"]["Tables"]["food_calculations"]["Row"];
